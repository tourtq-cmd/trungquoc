/**
 * Firestore + Firebase Authentication
 */
(function () {
  window.CMS_firebaseData = null;
  window.CMS_firebaseReady = false;
  window.CMS_db = null;
  window.CMS_auth = null;
  window.CMS_unsubscribe = null;

  var CMS_COLLECTION = "cms";
  var CMS_DOC = "content";

  function hasConfig() {
    var c = window.FIREBASE_CONFIG;
    return c && c.apiKey && c.projectId;
  }

  function parseDoc(doc) {
    if (!doc.exists) return null;
    var d = doc.data();
    window.CMS_firebaseData = d.data || d;
    return window.CMS_firebaseData;
  }

  window.CMS_initFirebase = function () {
    return new Promise(function (resolve) {
      if (!hasConfig()) {
        resolve(false);
        return;
      }
      if (typeof firebase === "undefined") {
        resolve(false);
        return;
      }
      try {
        if (!firebase.apps.length) {
          firebase.initializeApp(window.FIREBASE_CONFIG);
        }
        window.CMS_db = firebase.firestore();
        window.CMS_auth = firebase.auth();
        window.CMS_firebaseReady = true;
        resolve(true);
      } catch (e) {
        console.error(e);
        resolve(false);
      }
    });
  };

  window.CMS_signIn = function (email, password) {
    return window.CMS_initFirebase().then(function (ok) {
      if (!ok) return Promise.reject(new Error("Firebase chưa cấu hình"));
      return window.CMS_auth.signInWithEmailAndPassword(email, password);
    });
  };

  window.CMS_signOut = function () {
    if (window.CMS_unsubscribe) {
      window.CMS_unsubscribe();
      window.CMS_unsubscribe = null;
    }
    if (window.CMS_auth) return window.CMS_auth.signOut();
    return Promise.resolve();
  };

  window.CMS_onAuthChanged = function (callback) {
    return window.CMS_initFirebase().then(function (ok) {
      if (!ok || !window.CMS_auth) {
        callback(null);
        return;
      }
      window.CMS_auth.onAuthStateChanged(callback);
    });
  };

  /** Đọc từ server (không dùng cache cũ) */
  window.CMS_loadFirebase = function () {
    return window.CMS_initFirebase().then(function (ok) {
      if (!ok) return null;
      var ref = window.CMS_db.collection(CMS_COLLECTION).doc(CMS_DOC);
      return ref
        .get({ source: "server" })
        .then(parseDoc)
        .catch(function () {
          return ref.get().then(parseDoc);
        })
        .catch(function (err) {
          console.error("CMS_loadFirebase:", err);
          return null;
        });
    });
  };

  /** Máy khác / tab khác tự cập nhật khi admin Lưu */
  window.CMS_watchFirebase = function (onChange) {
    return window.CMS_initFirebase().then(function (ok) {
      if (!ok) return;
      if (window.CMS_unsubscribe) window.CMS_unsubscribe();
      window.CMS_unsubscribe = window.CMS_db
        .collection(CMS_COLLECTION)
        .doc(CMS_DOC)
        .onSnapshot(
          function (doc) {
            var data = parseDoc(doc);
            if (data && typeof onChange === "function") onChange(data);
          },
          function (err) {
            console.error("CMS_watchFirebase:", err);
          }
        );
    });
  };

  window.CMS_saveFirebase = function (data) {
    return window.CMS_initFirebase().then(function (ok) {
      if (!ok) return Promise.reject(new Error("Chưa cấu hình firebase-config.js"));
      if (!window.CMS_auth || !window.CMS_auth.currentUser) {
        return Promise.reject(new Error("Chưa đăng nhập — không có quyền ghi"));
      }
      return window.CMS_db.collection(CMS_COLLECTION).doc(CMS_DOC).set({
        data: data,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
    });
  };

  window.CMS_seedFirebaseIfEmpty = function () {
    if (!window.CMS_auth || !window.CMS_auth.currentUser) {
      return Promise.resolve(null);
    }
    return window.CMS_loadFirebase().then(function (data) {
      if (data) return data;
      if (!window.CMS_DEFAULT) return null;
      var seed = Object.assign({}, window.CMS_DEFAULT);
      return window.CMS_saveFirebase(seed).then(function () {
        window.CMS_firebaseData = seed;
        return seed;
      });
    });
  };
})();
