var nameProduct, maProduct, sanPhamHienTai; // Tên sản phẩm trong trang này, 
// là biến toàn cục để có thể dùng ở bát cứ đâu trong trang
// không cần tính toán lấy tên từ url nhiều lần

window.onload = function () {
    khoiTao();

    phanTich_URL_chiTietSanPham();

    // autocomplete cho khung tim kiem
    autocomplete(document.getElementById('search-box'), list_products);

    // Thêm gợi ý sản phẩm
    sanPhamHienTai && suggestion();
}

function khongTimThaySanPham() {
    document.getElementById('productNotFound').style.display = 'block';
    document.getElementsByClassName('chitietSanpham')[0].style.display = 'none';
}

function phanTich_URL_chiTietSanPham() {
    nameProduct = window.location.href.split('?')[1]; // lấy tên
    if (!nameProduct) return khongTimThaySanPham();

    // tách theo dấu '-' vào gắn lại bằng dấu ' ', code này giúp bỏ hết dấu '-' thay vào bằng khoảng trắng.
    // code này làm ngược lại so với lúc tạo href cho sản phẩm trong file classes.js
    nameProduct = nameProduct.split('-').join(' ');

    for (var p of list_products) {
        if (nameProduct == p.name) {
            maProduct = p.masp;
            break;
        }
    }

    sanPhamHienTai = timKiemTheoMa(list_products, maProduct);
    if (!sanPhamHienTai) return khongTimThaySanPham();

    var divChiTiet = document.getElementsByClassName('chitietSanpham')[0];

    // Đổi title
    document.title = nameProduct + ' - Thế giới điện thoại';

    // Cập nhật tên h1
    var h1 = divChiTiet.getElementsByTagName('h1')[0];
    h1.innerHTML += nameProduct;

    // Cập nhật sao
    var rating = "";
    if (sanPhamHienTai.rateCount > 0) {
        for (var i = 1; i <= 5; i++) {
            if (i <= sanPhamHienTai.star) {
                rating += `<i class="fa fa-star"></i>`
            } else {
                rating += `<i class="fa fa-star-o"></i>`
            }
        }
        rating += `<span> ` + sanPhamHienTai.rateCount + ` đánh giá</span>`;
    }
    divChiTiet.getElementsByClassName('rating')[0].innerHTML += rating;

    // Cập nhật giá + label khuyến mãi
    var price = divChiTiet.getElementsByClassName('area_price')[0];
    if (sanPhamHienTai.promo.name != 'giareonline') {
        price.innerHTML = `<strong>` + sanPhamHienTai.price + `₫</strong>`;
        price.innerHTML += new Promo(sanPhamHienTai.promo.name, sanPhamHienTai.promo.value).toWeb();
    } else {
        document.getElementsByClassName('ship')[0].style.display = ''; // hiển thị 'giao hàng trong 1 giờ'
        price.innerHTML = `<strong>` + sanPhamHienTai.promo.value + `&#8363;</strong>
					        <span>` + sanPhamHienTai.price + `&#8363;</span>`;
    }

    // Cập nhật chi tiết khuyến mãi
    document.getElementById('detailPromo').innerHTML = getDetailPromo(sanPhamHienTai);

    // Cập nhật thông số
    var info = document.getElementsByClassName('info')[0];
    var s = addThongSo('Màn hình', sanPhamHienTai.detail.screen);
    s += addThongSo('Hệ điều hành', sanPhamHienTai.detail.os);
    s += addThongSo('Camara sau', sanPhamHienTai.detail.camara);
    s += addThongSo('Camara trước', sanPhamHienTai.detail.camaraFront);
    s += addThongSo('CPU', sanPhamHienTai.detail.cpu);
    s += addThongSo('RAM', sanPhamHienTai.detail.ram);
    s += addThongSo('Bộ nhớ trong', sanPhamHienTai.detail.rom);
    s += addThongSo('Thẻ nhớ', sanPhamHienTai.detail.microUSB);
    s += addThongSo('Dung lượng pin', sanPhamHienTai.detail.battery);
    info.innerHTML = s;

    // Cập nhật hình
    var hinh = divChiTiet.getElementsByClassName('picture')[0];
    hinh = hinh.getElementsByTagName('img')[0];
    hinh.src = sanPhamHienTai.img;
    document.getElementById('bigimg').src = sanPhamHienTai.img;

    // Hình nhỏ
    addSmallImg("img/products/huawei-mate-20-pro-green-600x600.jpg");
    addSmallImg("img/chitietsanpham/oppo-f9-mau-do-1-org.jpg");
    addSmallImg("img/chitietsanpham/oppo-f9-mau-do-2-org.jpg");
    addSmallImg("img/chitietsanpham/oppo-f9-mau-do-3-org.jpg");
    addSmallImg("img/products/huawei-mate-20-pro-green-600x600.jpg");
    addSmallImg("img/chitietsanpham/oppo-f9-mau-do-3-org.jpg");
    addSmallImg("img/products/huawei-mate-20-pro-green-600x600.jpg");

    // Khởi động thư viện hỗ trợ banner - chỉ chạy sau khi tạo xong hình nhỏ
    var owl = $('.owl-carousel');
    owl.owlCarousel({
        items: 5,
        center: true,
        smartSpeed: 450,
    });
}

// Chi tiết khuyến mãi
function getDetailPromo(sp) {
    switch (sp.promo.name) {
        case 'tragop':
            var span = `<span style="font-weight: bold"> lãi suất ` + sp.promo.value + `% </span>`;
            return `Khách hàng có thể mua trả góp sản phẩm với ` + span + `với thời hạn 6 tháng kể từ khi mua hàng.`;

        case 'giamgia':
            var span = `<span style="font-weight: bold">` + sp.promo.value + `</span>`;
            return `Khách hàng sẽ được giảm ` + span + `₫ khi tới mua trực tiếp tại cửa hàng`;

        case 'moiramat':
            return `Khách hàng sẽ được thử máy miễn phí tại cửa hàng. Có thể đổi trả lỗi trong vòng 2 tháng.`;

        case 'giareonline':
            var del = stringToNum(sp.price) - stringToNum(sp.promo.value);
            var span = `<span style="font-weight: bold">` + numToString(del) + `</span>`;
            return `Sản phẩm sẽ được giảm ` + span + `₫ khi mua hàng online bằng thẻ VPBank hoặc tin nhắn SMS`;

        default:
            var span = `<span style="font-weight: bold">61 xe Wave Alpha</span>`;
            return `Cơ hội trúng ` + span + ` khi trả góp Home Credit`;
    }
}

function addThongSo(ten, giatri) {
    return `<li>
                <p>` + ten + `</p>
                <div>` + giatri + `</div>
            </li>`;
}

// add hình
function addSmallImg(img) {
    var newDiv = `<div class='item'>
                        <a>
                            <img src=` + img + ` onclick="changepic(this.src)">
                        </a>
                    </div>`;
    var banner = document.getElementsByClassName('owl-carousel')[0];
    banner.innerHTML += newDiv;
}

// đóng mở xem hình
function opencertain() {
    document.getElementById("overlaycertainimg").style.transform = "scale(1)";
}

function closecertain() {
    document.getElementById("overlaycertainimg").style.transform = "scale(0)";
}

// đổi hình trong chế độ xem hình
function changepic(src) {
    document.getElementById("bigimg").src = src;
}

// Thêm sản phẩm vào các khung sản phẩm
function addKhungSanPham(list_sanpham, tenKhung, color, ele) {
    // mở tag
    var s = `<div class="khungSanPham" style="` + borderColor + `">
<h3 class="tenKhung" style="` + gradient + `">* ` + tenKhung + ` *</h3>
< class="listSpTrongKhung flexContain">`;
    // create a canvas element and draw a graphic related to the products
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    canvas.width = 150;
    canvas.height = 150;
    context.fillStyle = color[0];
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(canvas.width, canvas.height);
    context.moveTo(canvas.width, 0);
    context.lineTo(0, canvas.height);
    context.strokeStyle(color[1]);
    context.lineWidth = 5;
    context.stroke();

    // add the canvas to the product list container
    s += `< class="canvasContainer">${canvas.outerHTML}</div>`;

    for (var i = 0; i < _sanpham.length; i++) {
        s += addProduct(list_sanpham[i], null, true);
        // truyền vào 'true' để trả về chuỗi rồi gán vào s
    }

    // thêm khung vào contain-khung
    ele.innerHTML += s;
}
