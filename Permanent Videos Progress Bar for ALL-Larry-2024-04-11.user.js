// ==UserScript==
// @name         Permanent Videos Progress Bar for ALL-Larry
// @namespace    http://tampermonkey.net/
// @version      2024-04-11
// @description  Permanent Progress Bar for ALL videos--Enhances the video player functionality
// @author       Larry
// @match        https://www.youtube.com/*
// @match        https://www.youtube.com/embed/*
// @match        https://www.youtube-nocookie.com/embed/*
// @match        https://music.youtube.com/*
// @ match       https://www.youtube.com/watch?v=*
// @match        *://*/*
// @icon         https://lh3.googleusercontent.com/l_u3wgjicF_HCj9a2KX0ZEfTwM4dge_S4irKB4SQ2AFTytI_Bs0Ncb854JgFbEkcadgAtN5dCnIistGKDr3PnYII4b0=s60
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_openInTab
// @grant          GM_deleteValue
// @grant          GM_registerMenuCommand
// @grant          GM_notification
// @grant          GM_download
// @grant          GM.getValue
// @grant          GM.getResourceText
// @grant          GM.setValue
// @grant          GM.deleteValue
// @grant          GM.addStyle
// @grant          GM.openInTab
// @grant          GM.setClipboard
// @grant          GM.xmlHttpRequest
// @grant          GM.registerMenuCommand
// @grant          GM.notification
// @grant          GM_getResourceText
// @grant        GM_addValueChangeListener
// @grant        GM_unregisterMenuCommand


// ==/UserScript==




(function() {
    'use strict';


    const PREF = 'video_progress_bar_';
    const uID = id => PREF + id;
    const get = id => document.getElementById(id);
    const strToElement = str => {
        const template = document.createElement('template'); //<template> 元素是一種用於保存客戶端創建的HTML模板的特殊元素。它允許你創建一個HTML片段，但不會將其直接插入到文檔中。
        template.innerHTML = str;
        return template.content;
    };

    const addUI = (str, cont = document.body) => { //addUI 函數用於將字符串表示的 UI 元素添加到指定的容器或預設為 document.body。cont=>container
        const elem = strToElement(str);
        cont.prepend(elem); //cont.append(elem);  // 使用 cont.prepend(elem); 方法將新元素添加到容器的最上層// 將元素添加到 document.body 的最上層document.body.prepend(elem);

    };








    // 預設選項
    /*const chk_def = {    hide: 1,// 1 代表 true    bar_bottom: 1,// 1 代表 true    show_time: 1,// 1 代表 true};*/
    // 初始化 chk //let chk = { ...chk_def };


    // 預設選項
    const chk_def = {
        hide: GM_getValue('hide', 1), // 讓懸浮時隱藏，預設值為1
        bar_bottom: GM_getValue('bar_bottom', 1),// true在bottom,false在頂部，預設值為1
        show_time: GM_getValue('show_time', 1), // Show Time，預設值為1
        loadedColor: GM_getValue('loadedColor', '#0e6fbe'),
        trackColor: GM_getValue('trackColor', '#cc0000'),
        heightlarry: GM_getValue('heightlarry', '4px'),
    };



    // 從存儲中讀取設定或使用默認值
    const chk = {
        hide: GM_getValue('hide', chk_def.hide),
        bar_bottom: GM_getValue('bar_bottom', chk_def.bar_bottom),
        show_time: GM_getValue('show_time', chk_def.show_time),
        loadedColor: GM_getValue('loadedColor', chk_def.loadedColor),
        trackColor: GM_getValue('trackColor', chk_def.trackColor),
        heightlarry: GM_getValue('heightlarry', chk_def.heightlarry),
    };





    let zIndexlarry = "99990";
    let heightlarry = "3.5px"; //最好跟尾端的比例是可以相乘除得到整數



    const css = {
        time: {
            height: "4px",
            lineHeight: '8px', // 將 line-height 設置為相同的值
            display: 'inline-block',
            justifyContent: 'center',
            alignItems: 'center',
            fontFamily: '"Roboto", Sans-serif,"Lucida Console", "Courier New", "SF Mono", Monaco, monospace',
            fontSize: '12px',
            backgroundColor: 'rgba(25, 25, 25, .8)',
            padding:'6px',
            color: '#fff',
            zIndex: `${Number(zIndexlarry) + 6}`,
            left:'1%',
            bottom:`${parseFloat(chk.heightlarry) + 2}px`,
            position:'absolute',
            borderRadius: '5px',
            alignContent: 'center',
            whiteSpace: 'nowrap',
            ...(chk_def.bar_bottom === 1 ? { bottom: `${parseFloat(chk.heightlarry) + 2}px`} : { top: `${parseFloat(chk.heightlarry) + 2}px`}), // 条件设置bottom或top
        },
        bar: {
            height: chk.heightlarry,
            position: 'absolute',
            top: '0px',
            left: '0px',
            backgroundColor: 'rgba(1, 137, 118, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: `${Number(zIndexlarry) + 7}`,
            borderRadius: '10px',
            cursor: 'crosshair',

        },
        loaded: {
            height: chk.heightlarry,
            backgroundColor: chk.loadedColor,
            position: 'absolute',
            top: '0px',
            left: '0px',
            zIndex: `${Number(zIndexlarry) + 8}`, // 设置z-index值为更高的数字
            borderRadius: '10px',
            cursor: 'crosshair',

        },
        track: {
            height: chk.heightlarry,
            backgroundColor: chk.trackColor,
            zIndex: `${Number(zIndexlarry) + 9}`, // 设置z-index值为更高的数字
            borderRadius: '10px',
            cursor: 'crosshair',
        },
    };




    // 更改菜單選項----------------------------------------更新預覽顏色
    function updatePreview(type, value) {
        const preview = document.getElementById(`${type}Preview`);
        if (preview) {
            preview.style.backgroundColor = value;
        }
    }
    // 更改菜單選項----------------------------------------監聽color選擇器的變化並更新預覽顏色
    document.addEventListener('change', function(event) {
        if (event.target.type === 'color') {
            const type = event.target.id;
            const value = event.target.value;
            updatePreview(type, value);
        }
    });




    // -----------------------------------------------------------添加一個菜單命令---------------------------------------------------------------
    GM_registerMenuCommand("更改菜單選項", function() {
        let html = `
        <div style="font-size: 25px;">

    <label style="display: flex; justify-content: space-between; align-items: center; width: 100%;"><input type="checkbox" id="hide" ${chk.hide ? 'checked' : ''} style="transform: scale(2); margin-right: 10px;"> <span>讓懸浮時隱藏</span></label>
    <label style="display: flex; justify-content: space-between; align-items: center; width: 100%;"><input type="checkbox" id="bar_bottom" ${chk.bar_bottom ? 'checked' : ''} style="transform: scale(2); margin-right: 10px;"> <span>底部顯示</span></label>
    <label style="display: flex; justify-content: space-between; align-items: center; width: 100%;"><input type="checkbox" id="show_time" ${chk.show_time ? 'checked' : ''} style="transform: scale(2); margin-right: 10px;"> <span>Show Time</span></label>


    <label style="display: flex; justify-content: space-between; align-items: center; width: 100%;"><span>Height Larry :</span>
    <input type="text" id="heightlarry" value="${chk.heightlarry.replace('px', '')}" style="width: 30px; font-size: 20px; margin-left: 20px;" pattern="\d+" required> px</label>


    <label style="display: flex; justify-content: space-between; align-items: center; width: 100%;"><span>Loaded Color :</span>
    <input type="color" id="loadedColor" value="${chk.loadedColor}"></label>

    <label style="display: flex; justify-content: space-between; align-items: center; width: 100%;"><span>Track Color :</span>
    <input type="color" id="trackColor" value="${chk.trackColor}"></label>


        <!-- 預覽顏色區域 -->
        <div id="loadedColorPreview" style="width: 250px; height: 7px; background-color: ${chk.loadedColor}; border-radius: 10px; position: absolute; left: 20px; margin-top: 10px; "></div>
        <div id="trackColorPreview" style="width: 180px; height: 7px; background-color: ${chk.trackColor}; border-radius: 10px; position: absolute; left: 20px; margin-top: 10px; "></div>
        <br>


            <button id="saveBtn" style="font-size: 20px;background-color: #181a1b;border: 2px solid white;border-radius: 5px;" >儲存</button>
            <button id="cancelBtn" style="font-size: 20px;background-color: #181a1b;border: 2px solid white;border-radius: 5px;">取消</button>


        </div>
    `;


        let container = document.createElement('div');
        container.innerHTML = html;
        container.style.position = 'fixed';
        container.style.top = '50%';
        container.style.left = '50%';
        container.style.width = '250px';
        container.style.transform = 'translate(-50%, -50%)';
        container.style.backgroundColor = '#fff';
        container.style.padding = '20px';
        container.style.border = '1px solid #ccc';
        container.style.zIndex = '99999';
        container.style.borderRadius = '5px';
        document.body.appendChild(container);

        // 儲存按鈕的點擊事件
        document.getElementById('saveBtn').addEventListener('click', function() {
            chk.hide = document.getElementById('hide').checked ? 1 : 0;
            chk.bar_bottom = document.getElementById('bar_bottom').checked ? 1 : 0;
            chk.show_time = document.getElementById('show_time').checked ? 1 : 0;

            chk.heightlarry = `${document.getElementById('heightlarry').value}px`; // 加上 "px" 更新 heightlarry 的值

            chk.loadedColor = document.getElementById('loadedColor').value;
            chk.trackColor = document.getElementById('trackColor').value;


            GM_setValue('hide', chk.hide);
            GM_setValue('bar_bottom', chk.bar_bottom);
            GM_setValue('show_time', chk.show_time);

            GM_setValue('heightlarry', chk.heightlarry); // 儲存 heightlarry 的值

            GM_setValue('loadedColor', chk.loadedColor);
            GM_setValue('trackColor', chk.trackColor);



            // 重新刷新頁面
            location.reload();

            container.remove();
        });

        // 取消按鈕的點擊事件
        document.getElementById('cancelBtn').addEventListener('click', function() {
            container.remove();
        });
    });











    //absolute要有上層容器「可以被定位」的元素，不然這個元素的定位就是相對於該網頁所有內容，看起來就是這張網頁的絕對位置一樣
    //relative「相對地」調整其原本該出現的所在位置，而不管這些「相對定位」過的元素如何在頁面上移動位置或增加了多少空間，都不會影響到原本其他元素所在的位置
    //以下兩個都可以用
    GM_addStyle(`
        .vid_prog_cont_timepopup {
            background-color: rgba(0, 0, 0, .7);
            position: absolute;
            display: none;
            color: #fff;
            font-size: 12px;
            line-height: 12px;
            padding: 5px;
            font-family: "Roboto", Sans-serif;
            text-align: center;
            border-radius: 6px;
            z-index: 2147483647;
            white-space: nowrap;
        }

        .vid_prog_cont_timepopup::before  {
            content:"🚩";
        }

        .vid_prog_cont_bar:hover + .vid_prog_cont_timepopup {
            display: block;

        }
    `);


    //${chk_def.bar_bottom ? 'bottom: 8px;' : 'top: 8px;'



    const secondsToTimeString = time => {
        const sec = parseInt(time);
        if (!sec) return '--:--:--';
        const h = Math.floor(sec / 3600);
        const m = Math.floor((sec - h * 3600) / 60);
        const s = sec - h * 3600 - m * 60;
        const ms = m < 10 ? '0' + m : String(m);
        const ss = s < 10 ? '0' + s : String(s);
        if (h === 0) {
            return `${ms}:${ss}`;
        } else {
            return `${h}:${ms}:${ss}`;
        }
    }

    const format = _sec => {
        const sec = parseInt(_sec);
        if (!sec) return '--:--:--';
        const h = Math.floor(sec / 3600);
        const m = Math.floor((sec - h * 3600) / 60);
        const s = sec - h * 3600 - m * 60;
        const ms = m < 10 ? '0' + m : String(m);
        const ss = s < 10 ? '0' + s : String(s);
        if (h === 0) {
            return `${ms}:${ss}`;
        } else {
            return `${h}:${ms}:${ss}`;
        }
    }

    //設定時間格式
    const updateTime = vid => {
        const [t, d] = [vid.currentTime, vid.duration];
        const percentage = (t / d * 100).toFixed(1); // 計算百分比，並取一位小數
        return `${format(t)} / ${format(d)}⚡${percentage}%`;
    };


    const updateTimepop = vid => {
        const [popt, popd] = [vid.currentTime, vid.duration];
        return `${secondsToTimeString(popt)} / ${secondsToTimeString(popd)}`;
    };



    const ui = {};

    const storageGet = (cb) => {
        cb(GM_getValue('options', {}));
    };




    let _UPDATE;


    const applyOptions = (OBJ) => {
        const update = OBJ == _UPDATE;
        const findValue = (key, def) => {
            const is = (obj, prop) => obj.hasOwnProperty(prop);
            if (!is(OBJ, key[0])) return def;
            let obj = OBJ[key[0]];
            if (update) {
                if (is(obj, 'newValue')) {
                    obj = obj.newValue;
                } else {
                    return def;
                }
            }
            if (key.length == 1) return obj;
            return is(obj, key[1]) ? obj[key[1]] : def;
        }

        ['bar', 'time', 'track', 'loaded'].forEach(nm => {
            ui[nm] = get(uID(nm));
            const stl = ui[nm].style;
            const cs = css[nm];
            for (let k in cs) stl[k] = findValue([nm, k], update ? stl[k] : cs[k]);
        });
        for (let k in chk) chk[k] = findValue([k], update ? chk[k] : chk_def[k]);
    }






    const startPageCheck = (STORAGE) => {
        const id = setInterval(() => {
            //元素类型选择器：document.querySelector('video')  ID 选择器id：document.querySelector('#myVideo')  类选择器class：document.querySelector('.video-player')
            let vid = document.querySelector('video') || document.querySelector('.plyr__poster');

            if (!vid) return;
            //const par = vid.parentElement;
            //if (!par) return;

            const stl_p = getComputedStyle(vid.parentElement); // 保留此行，但不使用 par 參考,獲取視頻的父元素（通常是包含視頻的容器）的計算樣式。
            if (stl_p.position == 'static') vid.parentElement.style.position = 'relative'; //  par = vid.parentElement

            // 創建 larryVideoProgress 容器並添加到 document.body
            const larryVideoProgress = document.createElement('div');
            larryVideoProgress.id = 'larryVideoProgress';

            //document.body.appendChild(larryVideoProgress);// 将 larryVideoProgress 添加到網頁獨立選擇器

            // 將 larryVideoProgress 插入到 vid.parentElement 的頂部
            vid.parentElement.insertBefore(larryVideoProgress, vid.parentElement.firstChild);

            // 將 bar、loaded、track 和 time 添加到 document.body＝larryVideoProgress 容器  取代vid.parentElement
            addUI(
                `<div id="${uID('bar')}" class="vid_prog_cont_bar">
                 <l id="${uID('loaded')}"></l>
                 <t id="${uID('track')}" class="vid_prog_cont_track" ></t>
                 <div id="${uID('time')}" class="vid_prog_cont_time"></div>
                 </div>
                 <div id="${uID('timepopup')}" class="vid_prog_cont_timepopup"></div>
               `, larryVideoProgress); // 更新 par 參考為 vid.parentElement or , larryVideoProgress

            applyOptions(STORAGE);


            ui.bar = get(uID('bar'));
            ui.time = get(uID('time'));
            ui.timepopup = get(uID('timepopup'));
            ui.track = get(uID('track'));


            ui.time.style.display = chk.show_time ? 'block' : 'none'; // 更改为 block 或其他适当的值//ui.time.style.display = chk['show_time'] ? 'flex' : 'none';
            const vz = parseInt(getComputedStyle(vid).zIndex);
            ui.bar.style.zIndex = vz ? vz + 1 : 1;



            let yc = document.querySelector('.ytp-chrome-controls');//測試：time是否可以比contrl panel高 ，可能編寫問題，暫時無用
            ui.time.style.zIndex = parseInt(getComputedStyle(yc).zIndex) + 10;//可能編寫問題，暫時無用





            // ----------------------------获取.ytp-chrome-bottom的元素作为后缀的元素[class$="-bottom"]----------------------------
            const panelbs= document.querySelectorAll('[class$="-bottom"]');
            // 設置它们的 bottom 属性
            if (chk_def.bar_bottom === 1) {
                panelbs.forEach(panelb => {
                    panelb.style.bottom = `${parseFloat(heightlarry) * 1}px`;
                });
            }




            /*hide--改為顯示*/
            /* const onMouseOver = evt => {
                if (!msg.on) return;
                if (chk['hide']) get(uID('bar')).style.display = 'flex'; //替換none--改為顯示flex

            };
            const onMouseOut = evt => {
                if (!msg.on) return;
                if (chk['hide']) get(uID('bar')).style.display = 'flex';

            };
            vid.addEventListener('mouseover', onMouseOver);
            vid.addEventListener('mouseout', onMouseOut);
            const panel = document.querySelector('.ytp-chrome-bottom');


            if (panel) {
                panel.addEventListener('mouseover', onMouseOver);
                panel.addEventListener('mouseout', onMouseOut);

            }
            const msg = { on: true };
            window.addEventListener('message', function(event) {
                if (event.source != window) return;
                if (event.data.type && (event.data.type == 'FROM_PAGE')) {
                    msg.on = event.data.on;
                    get(uID('bar')).style.display = event.data.on ? 'flex' : 'none';
                }
            }); */
            /*hide--改為顯示*/





            const updateProgress = () => {
                // ----------------------------------更新进度条----------------------------------
                ui.time.textContent = updateTime(vid);
                const stl = ui.bar.style;
                const rv = vid.getBoundingClientRect(); //返回一個 DOMRect 對象，提供了視頻播放器的位置和尺寸信息。
                const rp = vid.parentElement.getBoundingClientRect(); //同樣返回一個 DOMRect 對象，但是這次是針對視頻播放器的父元素（容器）。//  par = vid.parentElement
                stl.width = getComputedStyle(vid).width;
                const vh = chk.bar_bottom ? vid.offsetHeight - parseInt(getComputedStyle(ui.bar).height) : 0;


                [stl.left, stl.top] = [(rv.x - rp.x) + 'px', (vh) + 'px'];

                const tw = 0 || parseInt(getComputedStyle(ui.time).width);
                const max_w = parseInt(getComputedStyle(ui.bar).width) - 10;
                const per = Math.max(0, vid.currentTime / vid.duration);
                ui.track.style.width = `${per * max_w}px`;
                //ui.track.style.zIndex = 99999;

                // ---------------------------------更新loaded的缓冲进度条---------------------------------
                // 更新已緩衝的百分比並更新 UI
                const loadedPercentage = vid.buffered.length > 0 ? (() => {
                    for (let i = 0; i < vid.buffered.length; i++) {
                        const start = vid.buffered.start(i);
                        const end = vid.buffered.end(i);

                        if (vid.currentTime >= start && vid.currentTime <= end) {
                            return end / vid.duration; // 找到當前緩衝段後返回百分比並退出迴圈
                        }
                    }
                    return 0; // 如果沒有找到當前緩衝段，返回 0
                })() : 0;

                ui.loaded.style.width = `${loadedPercentage * max_w}px`;
            };

            updateProgress();

            // 添加事件监听器
            vid.addEventListener('timeupdate', updateProgress);







            /*可直接移動創造的bar to seek time*/
            const seekBarClicked = (e) => {
                e.preventDefault();
                e.stopImmediatePropagation();
                const rect = ui.bar.getBoundingClientRect();
                const tw = Math.ceil(parseFloat(getComputedStyle(ui.time).width)) || 0; //timer width
                const barLength = parseInt(getComputedStyle(ui.bar).width) - 10; // This number should compensate paddings and margins
                const barPercentage = (e.clientX - rect.left) / barLength;
                vid.currentTime = Math.round(vid.duration * barPercentage);
            }

            ui.bar.addEventListener('click', seekBarClicked);

            /*直接移動創造的bar to seek  timepopup*/
            const mouseMoved = (e) => {
                const rect = ui.bar.getBoundingClientRect();
                const tw = Math.ceil(parseFloat(getComputedStyle(ui.time).width)) || 0; //timer width
                const barLength = parseInt(getComputedStyle(ui.bar).width) - 10;// 計算進度條的長度，並減去20像素
                let barPercentage = (e.clientX - rect.left) / barLength;// 計算滑鼠在進度條上的位置百分比
                if(barPercentage > 1){
                    barPercentage = 1;
                }else if(barPercentage < 0){
                    barPercentage = 0;
                }
                const time = Math.round(vid.duration * barPercentage);// 根據百分比計算對應的時間
                const percentage = (time / vid.duration * 100).toFixed(1); // 計算百分比，並取一位小數
                ui.timepopup.innerHTML = `${secondsToTimeString(time)}⚡${percentage}%`;// 顯示時間在ui.timepopup元素中

                //ui.timepopup.style.left = (e.clientX + 5)+'px'; //PPTPLAY起始點是視窗最左邊，重點在CSS要採用absolute or relative
                ui.timepopup.style.left = (e.clientX - rect.left+5)+'px';// 設定時間提示框的水平位置，Youtube-left起始點是bar最左邊,Youtube或gimy-left起始點是bar最左邊


                const stypop = ui.timepopup.style;
                const vhpop = chk.bar_bottom ? vid.offsetHeight * 0.96 :vid.offsetHeight * 0.04 ;
                [stypop.top] = [(vhpop) + 'px'];

                /*if(chk.bar_bottom){ui.timepopup.style.bottom = (window.innerHeight - e.pageY + 8)+'px'; // 設定時間提示框的垂直位置在e.clientY上方+10}else{
                ui.timepopup.style.top = (e.pageY + 8)+'px'; // 設定時間提示框的垂直位置在e.clientY上方+10}*/
            }

            ui.bar.addEventListener('mousemove', mouseMoved);
            /*可直接移動創造的bar to seek time*/









            /*********************************************************全屏模式變化**********************************************************/
            document.addEventListener("fullscreenchange", function() {
                if (document.fullscreenElement) {
                    adjustProgressBarSize(true);
                } else {
                    adjustProgressBarSize(false);
                }
            });

            const adjustProgressBarSize = (isFullScreen) => {
                const heightscale = isFullScreen ? 2 : 1/2;
                const timeTopBottomScale = isFullScreen ? 2 : 1/2; // 新增的比例因子
                const stlTime = ui.time.style; // 取得 time 元素的 style


                // 添加全屏模式下的bar loaded track height的调整
                for (let key in css) {
                    const stl = ui[key].style;
                    stl.height = parseInt(stl.height) * heightscale + 'px';
                    stl.zIndex = parseInt(stl.zIndex) + (isFullScreen ? 1 : -1);
                }



                // 添加全屏模式下的.ytp-chrome-bottom和.ytp-gradient-bottom的调整
                const panelbs = document.querySelectorAll('[class$="-bottom"]');
                const panelts = document.querySelectorAll('[class$="-top"]');
                // 設置其.ytp-chrome-bottom和.ytp-gradient-bottom的 bottom 離bar的距離
                if (chk_def.bar_bottom === 1) {
                    panelbs.forEach(panelb => {
                        panelb.style.bottom = `${parseFloat(heightlarry) * 1 * heightscale}px`;
                    });
                } else {
                    panelts.forEach(panelt => {
                        panelt.style.top = `${parseFloat(heightlarry) * 1 * heightscale}px`;
                    });
                }


                // 調整全屏模式下 固定time 元素的 top 或 bottom,如果chk_def.bar_bottom === 1只調整底部，否則只調整頂部
                if (chk_def.bar_bottom === 1) {
                    stlTime.bottom = parseInt(stlTime.bottom) * timeTopBottomScale + 'px';
                } else {
                    stlTime.top = parseInt(stlTime.top) * timeTopBottomScale + 'px';
                }
            };



            clearInterval(id);
        }, 2000);
    };



    storageGet(startPageCheck); // async
})();
