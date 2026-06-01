/**
 * Đồng bộ nội dung qua Cloud Firestore
 * Collection: cms → Document: content
 */
(function () {
  window.CMS_firebaseData = null;
  window.CMS_firebaseReady = false;
  window.CMS_db = null;

  var CMS_COLLECTION = "cms";
  var CMS_DOC = "content";

  function hasConfig() {
    var c = window.FIREBASE_CONFIG;
    return c && c.apiKey && c.projectId;
  }

  window.CMS_initFirebase = function () {
    return new Promise(function (resolve) {
      if (!hasConfig()) {
        resolve(false);
        return;
      }
      if (typeof firebase === "undefined") {
        console.warn("Firebase SDK chưa load");
        resolve(false);
        return;
      }
      try {
        if (!firebase.apps.length) {
          firebase.initializeApp(window.FIREBASE_CONFIG);
        }
        window.CMS_db = firebase.firestore();
        window.CMS_firebaseReady = true;
        resolve(true);
      } catch (e) {
        console.error(e);
        resolve(false);
      }
    });
  };

  window.CMS_loadFirebase = function () {
    return window.CMS_initFirebase().then(function (ok) {
      if (!ok) return null;
      return window.CMS_db
        .collection(CMS_COLLECTION)
        .doc(CMS_DOC)
        .get()
        .then(function (doc) {
          if (!doc.exists) return null;
          var d = doc.data();
          window.CMS_firebaseData = d.data || d;
          return window.CMS_firebaseData;
        })
        .catch(function (err) {
          console.error("CMS_loadFirebase:", err);
          return null;
        });
    });
  };

  window.CMS_saveFirebase = function (data) {
    return window.CMS_initFirebase().then(function (ok) {
      if (!ok) {
        return Promise.reject(
          new Error("Chưa cấu hình firebase-config.js")
        );
      }
      return window.CMS_db.collection(CMS_COLLECTION).doc(CMS_DOC).set({
        data: data,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
    });
  };

  window.CMS_isFirebaseActive = function () {
    return !!(window.CMS_firebaseReady && window.CMS_firebaseData);
  };

  /** Lần đầu: đẩy nội dung mặc định lên Firestore nếu chưa có */
  window.CMS_seedFirebaseIfEmpty = function () {
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
