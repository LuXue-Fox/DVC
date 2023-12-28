var search_text = document.querySelector('#search_text');
var element_check_box = new Array(9);
var obtain_check_box = new Array(18);
var result, all_aura, special_aura;
var all_dragon_bar = [];
var select_options = false;
var search_element = '';
var search_obtain = [];
var black_bg = document.getElementById('black_bg');
var detailed_div = document.getElementById('detailed_div');
var did_out_div = document.querySelector('.did_out_div');
var detailed_img_div = document.querySelector('.detailed_img_div');
var detailed_option_div_name = document.getElementById('detailed_option_div_name');
var detailed_option_div_en_name = document.getElementById('detailed_option_div_en_name');
var detailed_option_div_element = document.getElementById('detailed_option_div_element');
var detailed_option_div_obtain = document.getElementById('detailed_option_div_obtain');
var detailed_option_div_description = document.getElementById('detailed_option_div_description');
var detailed_option_div_skill0 = document.getElementById('detailed_option_div_skill0');
var detailed_option_div_skill1 = document.getElementById('detailed_option_div_skill1');
var detailed_option_div_point = document.getElementById('detailed_option_div_point');
var detailed_option_div_level = document.getElementById('detailed_option_div_level');
var detailed_option_div_color = document.getElementById('detailed_option_div_color');
var did_select;
var book_div = document.getElementById('book_div');
var tutorial_div = document.getElementById('tutorial_div');
var train_div = document.getElementById('train_div');
var personality_div = document.getElementById('personality_div');
var aura_div = document.getElementById('aura_div');
var aura_div_result = document.getElementById('aura_div_result');
var moon_div = document.getElementById('moon_div');

var change_illust_img_time = 2500;
var all_extra_illust = [];

function init() {

    change_main_top_bar('圖鑑');

    for (var i = 0; i < element_check_box.length; i++) {
        element_check_box[i] = document.getElementById('element' + i);
    }
    for (var i = 0; i < obtain_check_box.length; i++) {
        obtain_check_box[i] = document.getElementById('obtain' + i);
    }

    fetch('./DVC.json')
        .then(response => response.json()) // 解析JSON回應
        .then(data => {
            // 在這裡處理JSON資料
            result = data.dragon;
            all_aura = data.basic_aura;
            special_aura = data.special_aura;
            // console.log(result);
            search_list();
            show();
        })
        .catch(error => console.error('讀取資料時發生錯誤：', error));

    change_now_time();
}

function change_main_top_bar(target) {

    var n;
    var li = new Array(5);
    for (var i = 0; i < 5; i++) {
        li[i] = document.getElementById('main_top_bar_li' + i);
    }
    var element = [book_div, tutorial_div, train_div, personality_div, moon_div];

    if (target === '圖鑑') {
        n = 0;
    }
    else if (target === '技巧') {
        // n = 1;
    }
    else if (target === '訓練') {
        // n = 2;
    }
    else if (target === '個性') {
        n = 3;
    }
    else if (target === '月相') {
        n = 4;
        change_moon();
    }

    for (var i = 0; i < 5; i++) {
        if (i === n) {
            li[i].classList.add('main_top_bar_check');
            element[i].style.display = 'flex';
        }
        else {
            li[i].classList.remove('main_top_bar_check');
            element[i].style.display = 'none';
        }
    }
}

function search_list() {
    // 從某個資料來源中取得可能的選項
    const possibleOptions = [];

    for (var i = 0; i < result.length - 1; i++) {
        possibleOptions.push(result[i].name, result[i].en_name, result[i].description);
    }

    // 監聽輸入事件
    search_text.addEventListener('input', function (event) {
        const inputText = event.target.value.toLowerCase(); // 取得輸入文字（轉為小寫來進行比對）

        const suggestions = possibleOptions.filter(option =>
            option.toLowerCase().includes(inputText)
        ); // 從可能的選項中過濾出符合輸入文字的選項

        // 清空建議列表
        const datalist = document.getElementById('dynamicSearchOptions');
        datalist.innerHTML = '';

        // 將過濾出的選項加入建議列表
        suggestions.forEach(suggestion => {
            const option = document.createElement('option');
            option.value = suggestion;
            datalist.appendChild(option);
        });
    });
}

function remove_str(str) {
    var str1 = str.replace(/{/g, '');
    var str2 = str1.replace(/}/g, '');
    return str2;
}

function get_element(s) {
    if (s == '') return '';
    var en = {
        '風': 'wind', '火': 'fire', '水': 'water', '土': 'earth',
        '雷': 'lightning', '鋼': 'steel', '光': 'light', '暗': 'dark', '夢': 'dream',
    }
    var elements = s.split('/');
    var html_text = '';
    for (const element of elements) {
        html_text += ` <img src='image/element_${en[element]}_36.png'>`;
    }
    return html_text;
}

function get_obtain(arr, title) {
    if (arr.length == 0) return '';

    var color = {
        "希望之森": "#79FF79", "船骸": "#66B3FF	", "火山": "#FF9797", "風之神殿": "#7AFEC6", "天空神殿": "#80FFFF", "彩虹樂園": "#FFBB77",
        "荊棘之森": "#CA8EFF", "古龍之墓": "#CF9E9E", "黑暗祭壇": "#CA8EC2", "夢幻晶礦": "#A6A6D2", "混沌之隙": "#FF9D6F", "地下城堡": "#E2C2DE",
        "艾弗利亞": "#95CACA", "龍的請求": "#FFE66F	", "流浪商人": "#C2C287", "任務": "#BEBEBE", "繁殖": "#BEBEBE", "其他": "#BEBEBE"
    };
    var k = '';
    var index = 0;
    for (var obj of arr) {
        let key = Object.keys(obj); // 取得物件的第一個鍵
        let value = Object.values(obj); // 取得對應的值

        if (index > 0) k += "、";

        var span = '';
        if (title)
            span = `<span style='border-radius: 4px; background-color: ${color[key]}'>${key}</span>`;
        else
            span = value;

        k += span;
        index++;
    }
    return k;
}

function get_bg_color(obj) {
    var en = {
        'bk': '#A9A9A9', 'w': '#EEEEEE', 'rp': '#FFC0CB', 'p': '#D2A2CC', 'pb': '#AAAAFF', 'b': '#87CEEB',
        'bg': '#7AFED6', 'g': '#93FF93', 'gy': '#ADFF2F', 'y': '#FFFFAA', 'yr': '#FFC78E', 'r': '#FF9797'
    }
    var color = obj.code;
    if (typeof (obj.extra) != 'undefined' && typeof (obj.extra.sex) != 'undefined' && typeof (obj.extra.sex._f) != 'undefined') {
        color = obj.extra.sex._f;
    }
    if (!color) {
        return 'rgba(0, 0, 0, 0)';
    }
    return en[color];
}

function show() {
    var result_bar = document.querySelector('.result_bar');
    console.log(result.length);
    for (var i = 0; i < result.length; i++) {
        if (!result[i].png_name) continue;
        var dragon_bar = document.createElement('div');
        var name_bar = document.createElement('div');
        var element_bar = document.createElement('div');
        var obtain_bar = document.createElement('div');
        var description_bar = document.createElement('div');
        dragon_bar.classList.add('dragon_bar');
        name_bar.classList.add('dragon_option_bar');
        element_bar.classList.add('dragon_option_bar');
        obtain_bar.classList.add('dragon_option_bar');
        description_bar.classList.add('dragon_option_bar');
        var point = (!result[i].point ? '' : ' [' + result[i].point + ']');
        name_bar.innerText = '名稱：' + result[i].name + point;
        element_bar.innerHTML = '屬性：' + get_element(result[i].element);
        obtain_bar.innerHTML = '來源：' + get_obtain(result[i].obtain, true);
        description_bar.innerText = '描述：' + remove_str(result[i].description);
        dragon_bar.appendChild(name_bar);
        dragon_bar.appendChild(element_bar);
        dragon_bar.appendChild(obtain_bar);
        dragon_bar.appendChild(description_bar);

        var image_bar = document.createElement('div');
        image_bar.classList.add('dragon_img_bar');
        var egg_div = document.createElement('div');
        var hatch_div = document.createElement('div');
        var hatchling_div = document.createElement('div');
        var adult_div = document.createElement('div');
        var egg_img = document.createElement('img');
        var hatch_img = document.createElement('img');
        var hatchling_img = document.createElement('img');
        var adult_img = document.createElement('img');
        egg_img.loading = hatch_img.loading = hatchling_img.loading = adult_img.loading = 'lazy';

        var png_name = result[i].png_name.replace(/[^a-zA-Z]/g, '').toLowerCase();
        var u = 'https://res.dvc.land/dvc-illust/';  // ./dragon_illust/
        if (check_image(i, "egg")) egg_img.src = u + png_name + '_egg.png';
        if (check_image(i, "hatch")) hatch_img.src = u + png_name + '_hatch.png';
        if (check_image(i, "hatchling")) hatchling_img.src = u + png_name + '_hatchling.png';
        if (check_image(i, "adult")) adult_img.src = u + png_name + '_adult.png';

        egg_div.appendChild(egg_img);
        hatch_div.appendChild(hatch_img);
        hatchling_div.appendChild(hatchling_img);
        adult_div.appendChild(adult_img);
        image_bar.appendChild(egg_div);
        image_bar.appendChild(hatch_div);
        image_bar.appendChild(hatchling_div);
        image_bar.appendChild(adult_div);
        dragon_bar.appendChild(image_bar);

        result_bar.appendChild(dragon_bar);
        all_dragon_bar.push(dragon_bar);
        add_click_action(i);

        if (result[i].extra_illust) {
            if (result[i].extra_illust.hatch) {
                all_extra_illust.push({ png_name: png_name, element: hatch_img, img: result[i].extra_illust.hatch, num: 0 });
            }
            if (result[i].extra_illust.hatchling) {
                all_extra_illust.push({ png_name: png_name, element: hatchling_img, img: result[i].extra_illust.hatchling, num: 0 });
            }
            if (result[i].extra_illust.adult) {
                all_extra_illust.push({ png_name: png_name, element: adult_img, img: result[i].extra_illust.adult, num: 0 });
            }
        }
    }
    change_illust_img();
}

function check_image(i, stage) {
    return ((typeof (result[i].extra) == 'undefined' && typeof (result[i].extra_illust) == 'undefined') ||
        (typeof (result[i].extra) != 'undefined' && typeof (result[i].extra[stage]) == 'undefined') ||
        (typeof (result[i].extra_illust) != 'undefined' && typeof (result[i].extra_illust[stage]) == 'undefined'));
}

function add_click_action(i) {
    all_dragon_bar[i].addEventListener('click', function () {
        change_detailed_div(i);
    });
}

function change_option_bar(btn) {
    select_options = !select_options;
    var element_bar = document.getElementById('element_bar');
    var obtain_bar = document.getElementById('obtain_bar');
    if (select_options) {
        element_bar.style.display = obtain_bar.style.display = 'flex';
        btn.value = '▲';
    }
    else {
        element_bar.style.display = obtain_bar.style.display = 'none';
        btn.value = '▼';
    }
}

function change_element() {
    search_element = '';
    for (var i = 0; i < element_check_box.length; i++) {
        if (element_check_box[i].checked) {
            search_element += element_check_box[i].value;
        }
    }
    Conditional_show();
    change_select_btn_color();
}

function change_obtain() {
    search_obtain = [];
    for (var i = 0; i < obtain_check_box.length; i++) {
        if (obtain_check_box[i].checked) {
            search_obtain.push(obtain_check_box[i].value);
        }
    }
    // console.log(search_obtain);
    Conditional_show();
    change_select_btn_color();
}

function clear_conditional() {
    for (var i = 0; i < element_check_box.length; i++) {
        element_check_box[i].checked = false;
    }
    for (var i = 0; i < obtain_check_box.length; i++) {
        obtain_check_box[i].checked = false;
    }
    search_element = '';
    search_obtain = [];
    search_text.value = '';
    Conditional_show();
    change_select_btn_color();
}

function change_select_btn_color() {
    if (search_element != '' || search_obtain.length > 0) {
        document.getElementById('select_btn').style.backgroundColor = 'yellow';
    }
    else {
        document.getElementById('select_btn').style.backgroundColor = 'white';
    }
}

function Conditional_show() {
    detailed_div.style.display = 'none';
    var text = search_text.value.replace(/\s/g, '').toLowerCase();
    for (var i = 0; i < result.length - 1; i++) {
        if (!containsSomeOfTheCharacters(result[i].element, search_element)) {
            all_dragon_bar[i].style.display = 'none';
        }
        else {
            if (
                (result[i].name.includes(text) || result[i].description.includes(text) || result[i].en_name.replace(/\s/g, '').toLowerCase().includes(text)) &&
                obtain_select(result[i].obtain)
            ) {
                all_dragon_bar[i].style.display = 'block';
            }
            else {
                all_dragon_bar[i].style.display = 'none';
            }
        }
    }
}

function containsSomeOfTheCharacters(strA, strB) {
    if (strB === '') return true;
    for (let i = 0; i < strB.length; i++) {
        if (strA.indexOf(strB[i]) != -1) {
            return true;
        }
    }
    return false;
}

function get_obtain_key(arr) {
    var s = '';
    for (var obj of arr) {
        let key = Object.keys(obj); // 取得物件的第一個鍵
        s += key;
    }
    return s;
}

function obtain_select(arr) {
    if (search_obtain.length === 0) return true;
    for (let i = 0; i < search_obtain.length; i++) {
        if (get_obtain_key(arr).indexOf(search_obtain[i]) != -1) {
            return true;
        }
    }
    return false;
}

function dragon_link(name) {
    var index = result.findIndex(item => item.name === name);
    if (index !== -1) {
        change_detailed_div(index);
    }
}

function add_span(str) {
    var str_result = str.replace(/{/g, `<span class='link_span' onclick='dragon_link(this.innerText)'>`).replace(/}/g, "</span>");
    return str_result;
}

function get_color(obj) {
    var en = {
        'bk': '黑色<img src="image/badge_color_bk_001.png">',
        'w': '白色<img src="image/badge_color_w_001.png">',
        'rp': '粉紅色<img src="image/badge_color_rp_001.png">',
        'p': '紫色<img src="image/badge_color_p_001.png">',
        'pb': '紫藍色<img src="image/badge_color_pb_001.png">',
        'b': '藍色<img src="image/badge_color_b_001.png">',
        'bg': '藍綠色<img src="image/badge_color_bg_001.png">',
        'g': '綠色<img src="image/badge_color_g_001.png">',
        'gy': '黃綠色<img src="image/badge_color_gy_001.png">',
        'y': '黃色<img src="image/badge_color_y_001.png">',
        'yr': '紅黃色<img src="image/badge_color_yr_001.png">',
        'r': '紅色<img src="image/badge_color_r_001.png">'
    }
    var colors = [];
    if (obj.code) colors = [obj.code];
    else if (typeof (obj.extra) != 'undefined' && typeof (obj.extra.sex) != 'undefined') {
        if (typeof (obj.extra.sex._m) != 'undefined') colors.push(obj.extra.sex._m);
        if (typeof (obj.extra.sex._f) != 'undefined') colors.push(obj.extra.sex._f);
        if (typeof (obj.extra.sex._n) != 'undefined') colors.push(obj.extra.sex._n);
    }
    else return '';

    var s = ''
    colors.forEach((color, index) => {
        if (index > 0) s += ' | '
        s += en[color];
    })
    return s;
}

function change_detailed_div(i) {
    detailed_img_div.style.backgroundColor = get_bg_color(result[i].pixel_img.num[0]);
    change_detailed_div_img(i);
    black_bg.style.display = '';
    detailed_div.style.display = 'flex';
    detailed_option_div_name.innerText = '中文名稱：' + result[i].name;
    detailed_option_div_en_name.innerText = '英文名稱：' + result[i].en_name;
    detailed_option_div_element.innerHTML = '屬性：' + get_element(result[i].element);
    detailed_option_div_obtain.innerHTML = '來源：' + add_span(get_obtain(result[i].obtain, false));
    detailed_option_div_description.innerText = '描述：' + result[i].description;
    for (var j = 0; j < 2; j++) {
        document.getElementById('personality' + j).innerText = result[i].potential[j].personality;
        for (var a = 0; a < 4; a++) {
            document.getElementById('p' + j + 'v' + a).innerText = (typeof (result[i].potential[j].value[a]) != 'undefined' ? result[i].potential[j].value[a] : '-');
        }
    }
    detailed_option_div_skill0.innerHTML = '特殊行動1：' + (!result[i].skill[0] ? '無' : add_span(result[i].skill[0]));
    detailed_option_div_skill1.innerHTML = '特殊行動2：' + (!result[i].skill[1] ? '無' : add_span(result[i].skill[1]));
    detailed_option_div_point.innerText = '龍蛋點數：' + (!result[i].point ? '無' : result[i].point);
    detailed_option_div_level.innerText = '遺傳權重：' + (!result[i].level ? '未知' : result[i].level);
    detailed_option_div_color.innerHTML = '顏色：' + get_color(result[i].pixel_img.num[0]);
}

function change_detailed_div_img(i) {
    did_out_div.innerHTML = '';
    did_select = { element: [], num: 0, index: i };
    result[i].pixel_img.num.forEach((num, index) => {

        var did_in_div = document.createElement('div');
        var pixel_img_div_name = document.createElement('div');
        var pixel_img_div_gender = document.createElement('div');
        var pixel_img_div_adult = document.createElement('div');
        var pixel_img_div_hatchling = document.createElement('div');
        var pixel_img_div_hatch = document.createElement('div');
        var pixel_img_div_egg = document.createElement('div');
        did_in_div.classList.add('did_in_div');
        pixel_img_div_name.classList.add('pixel_img_div_name');
        pixel_img_div_gender.classList.add('pixel_img_div_gender');
        pixel_img_div_adult.classList.add('pixel_img_div_adult');
        pixel_img_div_hatchling.classList.add('pixel_img_div_hatchling');
        pixel_img_div_hatch.classList.add('pixel_img_div_hatch');
        pixel_img_div_egg.classList.add('pixel_img_div_egg');
        pixel_img_div_adult.style.zIndex = 2;

        var top_name = (num.pattern ? num.pattern : '默認') + ' ' + result[i].name
        pixel_img_div_name.innerText = top_name;

        var maxWidth = (num.sex.length === 3 ? 33.3 : 50) + '%';
        pixel_img_div_adult.style.justifyContent = pixel_img_div_hatchling.style.justifyContent = pixel_img_div_hatch.style.justifyContent =
            (num.sex.length === 1 ? 'space-around' : 'space-between');

        var png_name = result[i].png_name.replace(/[^a-zA-Z]/g, '').toLowerCase();
        num.sex.forEach((sex) => {
            var code = {};
            code = { adult: num.code, hatchling: num.code, hatch: num.code };
            if (typeof (num.extra) != 'undefined') {
                if (typeof (num.extra.sex) != 'undefined')
                    code = { adult: num.extra.sex[sex], hatchling: num.extra.sex[sex], hatch: num.extra.sex[sex] };
                if (typeof (num.extra.stage) != 'undefined') {
                    Object.entries(num.extra.stage).forEach(([key, value]) => {
                        code[key] = value;
                    });
                }
            }

            var adult_div = document.createElement('div');
            var adult_img = document.createElement('img');
            if (typeof (num.extra) == 'undefined' || typeof (num.extra.adult) == 'undefined') {
                adult_div.classList.add('pixel_img_div');
                adult_img.classList.add('pixel_img_adult');
                var name = png_name + num.num + sex + '_adult_' + code.adult;
                adult_img.src = './DVC_pixel_dragon/' + name + '.png';
                var pixel_click_div = document.createElement('div');
                pixel_click_div.classList.add('pixel_click_div');
                adult_div.append(pixel_click_div);
                add_click_action_img(adult_div, pixel_click_div, i, name, top_name);
            }
            adult_div.appendChild(adult_img);
            pixel_img_div_adult.appendChild(adult_div);

            var hatchling_div = document.createElement('div');
            var hatchling_img = document.createElement('img');
            if (typeof (num.extra) == 'undefined' || typeof (num.extra.hatchling) == 'undefined') {
                hatchling_div.classList.add('pixel_img_div');
                hatchling_img.classList.add('pixel_img_hatchling');
                hatchling_img.src = './DVC_pixel_dragon/' + png_name + num.num + sex + '_hatchling_' + code.hatchling + '.png';
            }
            hatchling_div.appendChild(hatchling_img);
            pixel_img_div_hatchling.appendChild(hatchling_div);

            var hatch_div = document.createElement('div');
            var hatch_img = document.createElement('img');
            if (typeof (num.extra) == 'undefined' || typeof (num.extra.hatch) == 'undefined') {
                hatch_div.classList.add('pixel_img_div');
                hatch_img.classList.add('pixel_img_hatch');
                hatch_img.src = './DVC_pixel_dragon/' + png_name + num.num + sex + '_hatch_' + code.hatch + '.png';
            }
            hatch_div.appendChild(hatch_img);
            pixel_img_div_hatch.appendChild(hatch_div);

            adult_div.style.maxWidth = hatchling_div.style.maxWidth = hatch_div.style.maxWidth = maxWidth;

            var img = document.createElement('img');
            img.classList.add('gender_img');
            img.src = './image/gender' + sex + '_0101.png';
            pixel_img_div_gender.appendChild(img);
        })

        var egg_div = document.createElement('div');
        var egg_img = document.createElement('img');
        if (index == 0 && (typeof (num.extra) == 'undefined' || (typeof (num.extra) != 'undefined' && typeof (num.extra.egg) == 'undefined'))) {
            egg_div.classList.add('pixel_img_div');
            egg_img.classList.add('pixel_img_egg');
            egg_img.src = './egg/' + png_name + '_00_e_egg_' + result[i].pixel_img.egg_code + '.png';
        }
        egg_div.appendChild(egg_img);
        pixel_img_div_egg.appendChild(egg_div);

        did_in_div.appendChild(pixel_img_div_name);
        did_in_div.appendChild(pixel_img_div_gender);
        did_in_div.appendChild(pixel_img_div_adult);
        did_in_div.appendChild(pixel_img_div_hatchling);
        did_in_div.appendChild(pixel_img_div_hatch);
        did_in_div.appendChild(pixel_img_div_egg);

        did_out_div.appendChild(did_in_div);
        did_select.element.push(did_in_div);

        if (index != 0) did_in_div.style.display = 'none';
    })

    if (result[i].pixel_img.num.length > 1) {
        document.getElementById('prev_btn').style.display = '';
        document.getElementById('next_btn').style.display = '';
    }
    else {
        document.getElementById('prev_btn').style.display = 'none';
        document.getElementById('next_btn').style.display = 'none';
    }
}

function close_detailed_div() {
    black_bg.style.display = 'none';
    detailed_div.style.display = 'none';
    close_aura_div();
}

function color_to_num(obj) {
    var num = {
        'bk': 0, 'w': 1, 'rp': 2, 'p': 3, 'pb': 4, 'b': 5,
        'bg': 6, 'g': 7, 'gy': 8, 'y': 9, 'yr': 10, 'r': 11
    }
    var color = obj.code;
    if (typeof (obj.extra) != 'undefined' && typeof (obj.extra.sex) != 'undefined' && typeof (obj.extra.sex._f) != 'undefined') {
        color = obj.extra.sex._f;
    }
    if (!color) return "null";
    return num[color];
}

function sort_way(i) {
    var arr = [];
    result.forEach((value, index) => {
        if (i == 0 || i == 1 || i == 2)
            arr.push({ num: (!value.point ? "null" : value.point), index: index });
        if (i == 3 || i == 4)
            arr.push({ num: (!value.level ? "null" : value.level), index: index });
        if (i == 5 || i == 6)
            arr.push({ num: color_to_num(value.pixel_img.num[0]), index: index });
    });

    // 由高到低排序（數字部分）
    const sortByNumberDesc = (a, b) => {
        if (typeof a.num === 'number' && typeof b.num === 'number') {
            return b.num - a.num; // 由高到低排序
        } else if (typeof a.num === 'number') {
            return -1; // a是數字，排在前面
        } else if (typeof b.num === 'number') {
            return 1; // b是數字，排在前面
        } else {
            return 0; // 都不是數字，保持原始順序
        }
    };

    // 由低到高排序（數字部分）
    const sortByNumberAsc = (a, b) => {
        if (typeof a.num === 'number' && typeof b.num === 'number') {
            return a.num - b.num; // 由低到高排序
        } else if (typeof a.num === 'number') {
            return -1; // a是數字，排在前面
        } else if (typeof b.num === 'number') {
            return 1; // b是數字，排在前面
        } else {
            return 0; // 都不是數字，保持原始順序
        }
    };

    if (i == 1) {
        arr.sort(sortByNumberAsc);
    }
    else if (i == 2) {
        arr.sort(sortByNumberDesc);
    }
    else if (i == 3) {
        arr.sort(sortByNumberAsc);
    }
    else if (i == 4) {
        arr.sort(sortByNumberDesc);
    }
    else if (i == 5) {
        arr.sort(sortByNumberAsc);
    }
    else if (i == 6) {
        arr.sort(sortByNumberDesc);
    }
    dragon_sort(arr);
}

function dragon_sort(arr) {
    var result_bar = document.querySelector('.result_bar');
    arr.forEach((value, index) => {
        if (index == result.length - 1) return;
        const divToMove = all_dragon_bar[value.index]; // 要移動的<div>元素
        const newPosition = index; // 新的位置（第三個位置，索引從0開始）

        // 在新位置插入<div>元素
        result_bar.insertBefore(divToMove, result_bar.children[newPosition]);
    })
}

function select_did(i) {
    did_select.num = (did_select.num + did_select.element.length + i) % did_select.element.length;
    did_select.element.forEach((element, index) => {
        if (did_select.num === index) {
            element.style.display = '';
        }
        else {
            element.style.display = 'none';
        }
    })
    detailed_img_div.style.backgroundColor = get_bg_color(result[did_select.index].pixel_img.num[did_select.num]);
    detailed_option_div_color.innerHTML = '顏色：' + get_color(result[did_select.index].pixel_img.num[did_select.num]);
}

function add_click_action_img(element1, element2, i, name, top_name) {
    element1.classList.add('pixel_div_hover');
    pixel_img_anime(element1, false);
    element2.addEventListener('click', function () {
        show_aura_div(i, name, top_name);
    });
}

function pixel_img_anime(element, bool) {
    if (element) {
        if (bool) element.style.backgroundColor = 'rgba(255, 255, 255, 1)';
        else element.style.backgroundColor = 'rgba(255, 255, 255, 0)';
        setTimeout(() => {
            pixel_img_anime(element, !bool);
        }, 1000);
    }
}

function show_aura_div(i, dragon_name, top_name) {
    aura_div.style.display = '';
    document.getElementById('aura_div_top_name').innerText = top_name;

    var extra_personality = result[i].extra_personality || [];

    special_aura.forEach((personality) => {
        extra_personality.forEach((name) => {
            if (name === personality.name) {
                create_dragon_aura(personality, dragon_name);
            }
        })
    })

    all_aura.forEach((personality) => {
        create_dragon_aura(personality, dragon_name);
    })

    aura_div_result.scrollTo(0, 0);
}

function create_dragon_aura(personality, dragon_name) {
    var dragon_aura = document.createElement('div');
    dragon_aura.classList.add('dragon_aura');

    var dragon_aura_img_div = document.createElement('div');
    dragon_aura_img_div.classList.add('dragon_aura_img_div');

    if (personality.back) {
        var aura_dragon_img_img = document.createElement('img');
        aura_dragon_img_img.classList.add('aura_dragon_img_img');
        aura_dragon_img_img.classList.add('back_' + personality.back);
        aura_dragon_img_img.src = './aura_back/' + personality.back + '.png';
        dragon_aura_img_div.appendChild(aura_dragon_img_img);
    }
    if (dragon_name) {
        var aura_dragon_dragon_img = document.createElement('img');
        aura_dragon_dragon_img.classList.add('aura_dragon_dragon_img');
        aura_dragon_dragon_img.src = './DVC_pixel_dragon/' + dragon_name + '.png';
        dragon_aura_img_div.appendChild(aura_dragon_dragon_img);
    }
    if (personality.front) {
        var aura_dragon_img_img = document.createElement('img');
        aura_dragon_img_img.classList.add('aura_dragon_img_img');
        aura_dragon_img_img.classList.add('front_' + personality.front);
        aura_dragon_img_img.src = './aura_front/' + personality.front + '.png';
        dragon_aura_img_div.appendChild(aura_dragon_img_img);
    }
    dragon_aura.appendChild(dragon_aura_img_div);

    var dragon_aura_text_div = document.createElement('div');
    dragon_aura_text_div.classList.add('dragon_aura_text_div');
    dragon_aura_text_div.innerText = personality.name;
    dragon_aura.appendChild(dragon_aura_text_div);

    aura_div_result.appendChild(dragon_aura);
}

function close_aura_div() {
    aura_div.style.display = 'none';
    aura_div_result.innerHTML = '';
}

function toggleContent(element) {
    // 获取下一个兄弟元素（即相邻的 <div>）
    const nextElement = element.nextElementSibling;

    // 切换 <div> 的显示状态
    if (nextElement.style.display === 'none' || nextElement.style.display === '') {
        nextElement.style.display = 'block'; // 显示内容
    } else {
        nextElement.style.display = 'none'; // 隐藏内容
    }
}

function change_now_time() {
    if (moon_div.style.display == 'flex') {
        var now = new Date();
        var year = now.getFullYear();
        var month = (now.getMonth() + 1).toString().padStart(2, '0');
        var day = now.getDate().toString().padStart(2, '0');
        var hours = now.getHours().toString().padStart(2, '0');
        var minutes = now.getMinutes().toString().padStart(2, '0');
        var seconds = now.getSeconds().toString().padStart(2, '0');
        var daysOfWeek = ['日', '一', '二', '三', '四', '五', '六'];
        var dayOfWeek = daysOfWeek[now.getDay()];
        var timeString = year + '/' + month + '/' + day + ' ' + hours + ':' + minutes + ':' + seconds;

        document.getElementById('moon_now_time').innerText = timeString + ' (UTF+8)  星期' + dayOfWeek;
    }
    requestAnimationFrame(change_now_time);
}

function season(month, day) {
    if ((month === 3 && day >= 20) || (month === 4) || (month === 5) || (month === 6 && day < 21)) {
        return '<img src="image/season_spring_0101.png">春';
    } else if ((month === 6 && day >= 21) || (month === 7) || (month === 8) || (month === 9 && day < 22)) {
        return '<img src="image/season_summer_0101.png">夏';
    } else if ((month === 9 && day >= 22) || (month === 10) || (month === 11) || (month === 12 && day < 21)) {
        return '<img src="image/season_autumn_0101.png">秋';
    } else {
        return '<img src="image/season_winter_0101.png">冬';
    }
}

function change_moon() {
    const now = new Date();
    const month = now.getMonth() + 1; // JavaScript的月份是從0開始算，所以要加1
    const day = now.getDate();
    document.getElementById('moon_now_season').innerHTML = '季節：' + season(month, day);

    const firstDayOfMonth = new Date(2023, now.getMonth(), 1);
    const june29th = new Date(2023, 5, 29);
    const timeDifference = june29th.getTime() - firstDayOfMonth.getTime();
    const daysDifference = timeDifference / (1000 * 3600 * 24); // 毫秒轉換為天數
    var eclipse = (Math.abs(daysDifference)) % 150;
    document.getElementById('moon_now_moon').innerHTML = moon(eclipse);

    createCalendar();
}

function moon(eclipse) {
    if (eclipse == 0) return '<img src="image/season_eclipse_0101.png">月蝕';
    else if (eclipse % 30 == 0) return '<img src="image/season_fullmoon_0101.png">滿月';
    else if (eclipse % 30 <= 8) return '<img src="image/season_old_0101.png">下弦月';
    else if (eclipse % 30 <= 12) return '<img src="image/season_dark_0101.png">殘月';
    else if (eclipse % 30 <= 15) return '<img src="image/season_newmoon_0101.png">新月';
    else if (eclipse % 30 <= 19) return '<img src="image/season_crescent_0101.png">眉月';
    else if (eclipse % 30 <= 27) return '<img src="image/season_young_0101.png">上弦月';
    else return '<img src="image/season_fullmoon_0101.png">滿月';
}

function createCalendar() {
    const calendarDiv = document.getElementById('moon_now_table');
    calendarDiv.innerHTML = '';
    const currentDate = new Date();

    const firstDayOfMonth = new Date(2023, currentDate.getMonth(), 1);
    const june29th = new Date(currentDate.getFullYear(), 5, 29);
    // 計算天數差距
    const timeDifference = june29th.getTime() - firstDayOfMonth.getTime();
    const daysDifference = timeDifference / (1000 * 3600 * 24); // 毫秒轉換為天數
    var eclipse = (Math.abs(daysDifference)) % 150;

    for (let i = 0; i < 12; i++) {
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();

        const table = document.createElement('table');
        const headerRow = table.insertRow();

        // 建立表頭，顯示星期幾
        const daysOfWeek = ['日', '一', '二', '三', '四', '五', '六'];
        for (let day = 0; day < 7; day++) {
            const th = document.createElement('th');
            th.textContent = daysOfWeek[day];
            headerRow.appendChild(th);
        }

        // 建立表格內容
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const numRows = Math.ceil((lastDay.getDate() + firstDay.getDay()) / 7);

        let date = 1;
        for (let row = 0; row < numRows; row++) {
            const tableRow = table.insertRow();

            for (let cell = 0; cell < 7; cell++) {
                const tableCell = tableRow.insertCell();

                if (row === 0 && cell < firstDay.getDay()) {
                    // 空白的格子（在第一行，月份之前的日期）
                    continue;
                } else if (date > lastDay.getDate()) {
                    // 空白的格子（在月份之後的日期）
                    continue;
                }

                tableCell.innerHTML = date + '<br>' + season(month + 1, date) + '<br>' + moon(eclipse);
                if (i == 0 && date == currentDate.getDate()) {
                    tableCell.style.backgroundColor = '#2222cc';
                }
                date++;
                eclipse = (eclipse + 1) % 150;
            }
        }

        // 在日曆區塊中添加此月份的表格
        const monthName = currentDate.toLocaleString('default', { month: 'long' });
        const yearMonthHeader = document.createElement('h2');
        yearMonthHeader.textContent = `${year}年${monthName}`;
        calendarDiv.appendChild(yearMonthHeader);
        calendarDiv.appendChild(table);

        // 更新日期為下個月
        currentDate.setMonth(currentDate.getMonth() + 1);
    }
}

function change_illust_img() {
    setTimeout(change_illust_img, change_illust_img_time);
    all_extra_illust.forEach(object => {
        object.num = (object.num + 1) % object.img.length;
        object.element.src = 'https://res.dvc.land/dvc-illust/' + object.png_name + object.img[object.num];
    });
}

search_text.addEventListener('input', function (event) {
    Conditional_show();
});

search_text.addEventListener('change', function (event) {
    Conditional_show();
});