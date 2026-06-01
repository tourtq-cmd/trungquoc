/** Giao diện admin — nhóm section như bản cũ */
var SECTIONS = [
  { id: "meta", title: "Tiêu đề trang", keys: ["meta.title"] },
  { id: "nav", title: "Menu & Logo", keys: ["nav.logo","nav.link1","nav.link2","nav.link3","nav.link4","nav.link5","nav.cta","nav.mob1","nav.mob2","nav.mob3","nav.mob4","nav.mob5"] },
  { id: "hero", title: "Banner Hero", keys: ["hero.bg","hero.badge","hero.title","hero.sub","hero.stat1.val","hero.stat1.lbl","hero.stat2.val","hero.stat2.lbl","hero.stat3.val","hero.stat3.lbl","hero.stat4.val","hero.stat4.lbl","hero.btn1","hero.btn2","hero.scroll"] },
  { id: "trust", title: "Thanh uy tín", keys: ["trust.1.val","trust.1.lbl","trust.2.val","trust.2.lbl","trust.3.val","trust.3.lbl","trust.4.val","trust.4.lbl","trust.5.val","trust.5.lbl"] },
  { id: "hl", title: "Điểm nổi bật", keys: ["hl.label","hl.title","hl.sub","hl.1.img","hl.1.title","hl.1.text","hl.2.img","hl.2.title","hl.2.text","hl.3.img","hl.3.title","hl.3.text","hl.4.img","hl.4.title","hl.4.text"] },
  { id: "gal", title: "Thư viện ảnh", keys: ["gal.label","gal.title","gal.1.img","gal.1.cap","gal.2.img","gal.2.cap","gal.3.img","gal.3.cap","gal.4.img","gal.4.cap","gal.5.img","gal.5.cap"] },
  { id: "itin", title: "Lịch trình – chung", keys: ["itin.label","itin.title","itin.sub"] },
  { id: "day1", title: "Ngày 1", keys: ["day1.img","day1.title","day1.route","day1.meals","day1.acts"] },
  { id: "day2", title: "Ngày 2", keys: ["day2.img","day2.title","day2.route","day2.meals","day2.acts"] },
  { id: "day3", title: "Ngày 3", keys: ["day3.img","day3.title","day3.route","day3.meals","day3.acts"] },
  { id: "day4", title: "Ngày 4", keys: ["day4.img","day4.title","day4.route","day4.meals","day4.acts"] },
  { id: "price", title: "Bảng giá", keys: ["price.label","price.title","price.sub","price.p1.title","price.p1.amt","price.p1.note","price.p2.badge","price.p2.title","price.p2.amt","price.p2.note","price.p2.list","price.p3.title","price.p3.amt","price.p3.note","price.holiday"] },
  { id: "sched", title: "Lịch khởi hành (HTML bảng)", keys: ["sched.label","sched.title","sched.table"] },
  { id: "svc", title: "Dịch vụ", keys: ["svc.label","svc.title","svc.inc.img","svc.inc.title","svc.inc.list","svc.exc.img","svc.exc.title","svc.exc.list","svc.pay.title","svc.pay.text"] },
  { id: "cpol", title: "Trẻ em", keys: ["cpol.label","cpol.title","cpol.1.title","cpol.1.text","cpol.2.title","cpol.2.text","cpol.3.title","cpol.3.text","cpol.4.title","cpol.4.text"] },
  { id: "cancel", title: "Huỷ tour", keys: ["cancel.label","cancel.title","cancel.sub","cancel.1.title","cancel.1.text","cancel.2.title","cancel.2.text","cancel.3.title","cancel.3.text","cancel.4.title","cancel.4.text"] },
  { id: "notes", title: "Lưu ý", keys: ["notes.label","notes.title","notes.1.title","notes.1.list","notes.2.title","notes.2.list","notes.3.title","notes.3.list","notes.4.title","notes.4.list"] },
  { id: "rev", title: "Đánh giá", keys: ["rev.label","rev.title","rev.1.text","rev.1.avatar","rev.1.name","rev.1.loc","rev.2.text","rev.2.avatar","rev.2.name","rev.2.loc","rev.3.text","rev.3.avatar","rev.3.name","rev.3.loc"] },
  { id: "book", title: "Form đặt tour (tiêu đề)", keys: ["book.label","book.title","book.sub","book.bg"] },
  { id: "footer", title: "Chân trang", keys: ["footer.logo","footer.brand","footer.col1.title","footer.col2.title","footer.col3.title","footer.contact","footer.copy","footer.tag"] },
  { id: "contact", title: "Nút liên hệ nổi", keys: ["contact.phone","contact.zalo","contact.fb"] }
];

var LABELS = {
  "meta.title": "Tiêu đề tab trình duyệt",
  "nav.logo": "Logo menu (URL ảnh)",
  "hero.bg": "Ảnh nền banner (URL)",
  "hero.title": "Tiêu đề lớn (HTML: dùng <br>, <span>)",
  "day1.meals": "Bữa ăn ngày 1 (mỗi mục cách nhau bằng |)",
  "day1.acts": "Hoạt động ngày 1 (mỗi dòng cách nhau bằng |)",
  "sched.table": "Các dòng bảng lịch (HTML <tr>...)",
  "price.p2.list": "Danh sách ưu đãi gói người lớn (|)",
  "svc.inc.list": "Bao gồm (|)",
  "svc.exc.list": "Không bao gồm (|)",
  "footer.contact": "Thông tin liên hệ (HTML)"
};

function isImageKey(k) {
  return /\.(img|logo|avatar|bg)$/.test(k) || k.indexOf(".img") > -1 || k === "nav.logo" || k === "footer.logo";
}

function isLongKey(k) {
  return /\.(acts|list|table|contact)$/.test(k) || (k.indexOf(".text") > -1 && k.indexOf("hl.") === -1 && k.indexOf("rev.") === -1 && k.indexOf("cpol.") === -1 && k.indexOf("cancel.") === -1);
}

function isHtmlKey(k) {
  return k === "hero.title" || k === "price.holiday" || k === "footer.contact" || k === "sched.table" || /\.(text)$/.test(k) && k.indexOf("cpol.") > -1;
}

function labelFor(k) {
  if (LABELS[k]) return LABELS[k];
  return k.replace(/\./g, " › ");
}

function buildAdminForm() {
  var content = CMS_getContentForAdmin();
  var root = document.getElementById("sectionsRoot");
  root.innerHTML = "";

  SECTIONS.forEach(function (sec, idx) {
    var section = document.createElement("div");
    section.className = "section" + (idx < 3 ? " open" : "");
    section.dataset.section = sec.id;

    var hd = document.createElement("div");
    hd.className = "section-hd";
    hd.innerHTML = sec.title + ' <span>' + sec.keys.length + " mục</span>";
    hd.onclick = function () { section.classList.toggle("open"); };
    section.appendChild(hd);

    var bd = document.createElement("div");
    bd.className = "section-bd";

    sec.keys.forEach(function (key) {
      var val = content[key] != null ? content[key] : "";
      var field = document.createElement("div");
      field.className = "field";
      field.dataset.key = key;
      field.dataset.search = (labelFor(key) + " " + key + " " + val).toLowerCase();

      var lbl = document.createElement("label");
      lbl.innerHTML = labelFor(key) + ' <span class="key">' + key + "</span>";
      field.appendChild(lbl);

      var inp;
      if (isLongKey(key) || isHtmlKey(key) || (typeof val === "string" && val.length > 120)) {
        inp = document.createElement("textarea");
        inp.rows = key.indexOf("table") > -1 ? 8 : 4;
      } else {
        inp = document.createElement("input");
        inp.type = isImageKey(key) ? "url" : "text";
      }
      inp.value = val;
      inp.dataset.cmsKey = key;
      inp.oninput = function () {
        if (isImageKey(key)) updateFieldPreview(field, inp.value);
      };
      field.appendChild(inp);

      if (isImageKey(key)) {
        var hint = document.createElement("div");
        hint.className = "field-hint";
        hint.textContent = "Dán link ảnh https://... hoặc chọn file bên dưới";
        field.appendChild(hint);
        var prev = document.createElement("img");
        prev.className = "field-img-preview";
        prev.alt = "";
        if (val) prev.src = val;
        prev.onerror = function () { this.style.display = "none"; };
        field.appendChild(prev);
        var upload = document.createElement("input");
        upload.type = "file";
        upload.accept = "image/*";
        upload.style.marginTop = "8px";
        upload.onchange = function (e) {
          var file = e.target.files[0];
          if (!file) return;
          if (file.size > 800000) {
            alert("Ảnh quá lớn (>800KB). Nén ảnh hoặc dùng link URL.");
            return;
          }
          var reader = new FileReader();
          reader.onload = function (ev) {
            inp.value = ev.target.result;
            updateFieldPreview(field, inp.value);
          };
          reader.readAsDataURL(file);
        };
        field.appendChild(upload);
      }

      if (key.indexOf(".meals") > -1 || key.indexOf(".acts") > -1 || key.indexOf(".list") > -1) {
        var h2 = document.createElement("div");
        h2.className = "field-hint";
        h2.innerHTML = 'Mỗi mục cách nhau bằng <code>|</code>';
        field.appendChild(h2);
      }

      bd.appendChild(field);
    });

    section.appendChild(bd);
    root.appendChild(section);
  });
}

function updateFieldPreview(field, url) {
  var img = field.querySelector(".field-img-preview");
  if (img && url) {
    img.style.display = "block";
    img.src = url;
  }
}

function filterAdminFields() {
  var q = document.getElementById("searchBox").value.toLowerCase().trim();
  document.querySelectorAll(".field").forEach(function (f) {
    f.style.display = !q || (f.dataset.search || "").indexOf(q) >= 0 ? "" : "none";
  });
  if (q) {
    document.querySelectorAll(".section").forEach(function (s) {
      s.classList.add("open");
    });
  }
}

function collectAdminForm() {
  var data = Object.assign({}, CMS_DEFAULT);
  document.querySelectorAll("[data-cms-key]").forEach(function (inp) {
    data[inp.dataset.cmsKey] = inp.value;
  });
  return data;
}
