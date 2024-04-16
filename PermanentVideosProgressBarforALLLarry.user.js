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






    //为1（代表true）或0（代表false）
    const chk_def = {
        hide: 1, //讓懸浮時隱藏
        bar_bottom: 1, //true在bottom,false在頂部
        show_time: 1,
    };
    const chk = {...chk_def};



    let zIndexlarry = "99990";
    let heightlarry = "3.5px"; //最好跟尾端的比例是可以相乘除得到整數



    const css = {
        time: {
            height: heightlarry,
            display: 'inline-block',
            justifyContent: 'center',
            alignItems: 'center',
            //fontFamily: '"Lucida Console", "Courier New", "SF Mono", Monaco, monospace',
            fontSize: '10px',
            backgroundColor: 'rgba(25, 25, 25, .8)',
            padding:'6px',
            color: '#fff',
            zIndex: `${Number(zIndexlarry) + 6}`,
            left:'1%',
            bottom:'5px',
            position:'absolute',
            borderRadius: '5px',
            alignContent: 'center',
            whiteSpace: 'nowrap',
            ...(chk_def.bar_bottom === 1 ? { bottom: '5px' } : { top: '5px' }), // 条件设置bottom或top
        },
        bar: {
            height: heightlarry,
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
            height: heightlarry,
            backgroundColor:'#014c89',
            position: 'absolute',
            top: '0px',
            left: '0px',
            zIndex: `${Number(zIndexlarry) + 8}`, // 设置z-index值为更高的数字
            borderRadius: '10px',
            cursor: 'crosshair',

        },
        track: {
            height: heightlarry,
            backgroundColor: 'rgba(190,0,0,1)',
            zIndex: `${Number(zIndexlarry) + 9}`, // 设置z-index值为更高的数字
            borderRadius: '10px',
            cursor: 'crosshair',

        },

    };
    //absolute要有上層容器「可以被定位」的元素，不然這個元素的定位就是相對於該網頁所有內容，看起來就是這張網頁的絕對位置一樣
    //relative「相對地」調整其原本該出現的所在位置，而不管這些「相對定位」過的元素如何在頁面上移動位置或增加了多少空間，都不會影響到原本其他元素所在的位置
    //以下兩個都可以用
    GM_addStyle(`
        .vid_prog_cont_timepopup {
            background-color: rgba(0, 0, 0, .7);
            position: absolute;
            display: none;
            width: 50px;
            color: #fff;
            font-size: 12px;
            line-height: 12px;
            padding: 5px;
            font-family: "Roboto", Sans-serif;
            text-align: center;
            border-radius: 6px;
            z-index: 2147483647;
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
        return `${h}:${ms}:${ss}`;
    }

    const format = _sec => {
        const sec = parseInt(_sec);
        if (!sec) return '--:--:--';
        const h = Math.floor(sec / 3600);
        const m = Math.floor((sec - h * 3600) / 60);
        const s = sec - h * 3600 - m * 60;
        const ms = m < 10 ? '0' + m : String(m);
        const ss = s < 10 ? '0' + s : String(s);
        return `${h}:${ms}:${ss}`;
    }
    //設定時間格式
    const updateTime = vid => {
        const [t, d] = [vid.currentTime, vid.duration];
        return `${format(t)} / ${format(d)}`;
    };

    const updateTimepop = vid => {
        const [t, d] = [vid.currentTime, vid.duration];
        return `${secondsToTimeString(t)} / ${secondsToTimeString(d)}`;
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
            if (update)
                if (is(obj, 'newValue'))
                    obj = obj.newValue;
                else
                    return def;
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
            /***/
            let vid = document.querySelector('video') || document.querySelector('.plyr__poster');

            if (!vid) return;
            //const par = vid.parentElement;
            //if (!par) return;

            const stl_p = getComputedStyle(vid.parentElement); // 保留此行，但不使用 par 參考,獲取視頻的父元素（通常是包含視頻的容器）的計算樣式。
            if (stl_p.position == 'static') vid.parentElement.style.position = 'relative'; // 更新 par 參考為 vid.parentElement


            // 創建 larryVideoProgress 容器並添加到 document.body
            const larryVideoProgress = document.createElement('div');
            larryVideoProgress.id = 'larryVideoProgress';
            //document.body.appendChild(larryVideoProgress);// 将 larryVideoProgress 添加到網頁獨立選擇器


            // 將 larryVideoProgress 插入到 vid.parentElement 的頂部
            vid.parentElement.insertBefore(larryVideoProgress, vid.parentElement.firstChild);


            // 將 bar、loaded、track 和 time 添加到 document.body＝larryVideoProgress 容器  取代vid.parentElement
            addUI(
                `<div id="${uID('bar')}" class="vid_prog_cont_bar">
                 <div id="${uID('loaded')}"></div>
                 <div id="${uID('track')}" class="vid_prog_cont_track" ></div>
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


            // 获取.ytp-chrome-bottom的zIndex
            const panel = document.querySelector('.ytp-chrome-bottom');
            // 设置其.ytp-chrome-bottom的 bottom 離bar的距離
            if (panel) {
                panel.style.bottom = `${parseFloat(heightlarry) * 1}px`; //parseFloat函數來將字符串"3.5px"轉換為浮點數3.5，然後將其乘以2，最後再轉換回字符串並加上"px"
            };












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
                // ----------------------------------更新进度条
                ui.time.textContent = updateTime(vid);
                const stl = ui.bar.style;
                const rv = vid.getBoundingClientRect(); //返回一個 DOMRect 對象，提供了視頻播放器的位置和尺寸信息。
                const rp = vid.parentElement.getBoundingClientRect(); //同樣返回一個 DOMRect 對象，但是這次是針對視頻播放器的父元素（容器）。
                stl.width = getComputedStyle(vid).width;
                const vh = chk.bar_bottom ? vid.offsetHeight - parseInt(getComputedStyle(ui.bar).height) : 0;


                [stl.left, stl.top] = [(rv.x - rp.x) + 'px', (vh) + 'px'];

                const tw = 0 || parseInt(getComputedStyle(ui.time).width);
                const max_w = parseInt(getComputedStyle(ui.bar).width) - 10;
                const per = Math.max(0, vid.currentTime / vid.duration);
                ui.track.style.width = `${per * max_w}px`;
                //ui.track.style.zIndex = 99999;

                // ---------------------------------更新loaded的缓冲进度条
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
                ui.timepopup.innerHTML = `${secondsToTimeString(time)}`;// 顯示時間在ui.timepopup元素中

                //ui.timepopup.style.left = (e.clientX + 5)+'px'; //PPTPLAY起始點是視窗最左邊，重點在CSS要採用absolute or relative
                ui.timepopup.style.left = (e.clientX - rect.left+5)+'px';// 設定時間提示框的水平位置，Youtube-left起始點是bar最左邊,Youtube或gimy-left起始點是bar最左邊


                const stypop = ui.timepopup.style;
                const vhpop = chk.bar_bottom ? vid.offsetHeight * 0.96 :vid.offsetHeight * 0.04 ;
                [stypop.top] = [(vhpop) + 'px'];

                /*if(chk.bar_bottom){
                    ui.timepopup.style.bottom = (window.innerHeight - e.pageY + 8)+'px'; // 設定時間提示框的垂直位置在e.clientY上方+10
                }else{
                    ui.timepopup.style.top = (e.pageY + 8)+'px'; // 設定時間提示框的垂直位置在e.clientY上方+10
                }*/
            }

            ui.bar.addEventListener('mousemove', mouseMoved);
            /*可直接移動創造的bar to seek time*/










            document.addEventListener("fullscreenchange", function() {
                if (document.fullscreenElement) {
                    adjustProgressBarSize(true);
                } else {
                    adjustProgressBarSize(false);
                }
            });

            const adjustProgressBarSize = (isFullScreen) => {
                const heightscale = isFullScreen ? 2 : 1/2;
                const timeTopBottomScale = isFullScreen ? 1.4 : 1/1.4; // 新增的比例因子
                const stlTime = ui.time.style; // 取得 time 元素的 style

                for (let key in css) {
                    const stl = ui[key].style;
                    stl.height = parseInt(stl.height) * heightscale + 'px';
                    stl.zIndex = parseInt(stl.zIndex) + (isFullScreen ? 1 : -1);
                }

                // 調整 time 元素的 top 或 bottom,如果chk_def.bar_bottom === 1只調整底部，否則只調整頂部
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
