// ==UserScript==
// @name         TradingView Widget CSS-6.彈出小圖Stock view
// @namespace    https://www.tradingview.com/widget-docs/widgets/charts/advanced-chart/
// @version      2024-02-26
// @description  Track all markets on TradingView CSS
// @author       You
// @match        https://*.tradingview.com/chart/*
// @icon         https://static.tradingview.com/static/images/favicon.ico

// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_setClipboard
/// @grant        GM_getClipboard
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant                GM_deleteValue
// @grant                GM_registerMenuCommand
// @grant                GM_notification
// @grant                GM_download
// @grant                GM.getValue
// @grant                GM.setValue
// @grant                GM.deleteValue
// @grant                GM.addStyle
// @grant                GM.openInTab
// @grant                GM.setClipboard
// @grant                GM.xmlHttpRequest
// @grant                GM.registerMenuCommand
// @grant                GM.notification

// @run-at       document-end
// @sandbox      true

// ==/UserScript==


//------------------------------------------------------------------------TradingView彈出小圖-------------------------------------------------------------------------------
// 假设 idTV 是你要引用的股票代码
(function() {
    'use strict';

    const idTV = "NYSE:V";

    // 添加事件监听器，监视剪贴板变化
    document.addEventListener('paste', event => {
        // 阻止默认粘贴行为，避免将剪贴板内容粘贴到其他元素
        event.preventDefault();

        // 从剪贴板中获取文本
        const text = event.clipboardData.getData('text/plain');

        // 处理获取到的文本，这里可以根据需求进行进一步操作
        console.log('Text from clipboard:', text);

        // 示例：将剪贴板文本赋值给idTV变量
        idTV = text;

        // 在这里可以继续处理idTV或执行其他操作
    });

    // 示例：在页面加载后立即尝试读取剪贴板中的文本
    document.addEventListener('DOMContentLoaded', () => {
        navigator.clipboard.readText()
            .then(text => {
            console.log('Text from clipboard:', text);
            // 示例：将剪贴板文本赋值给idTV变量
            idTV = text;
            // 在这里可以继续处理idTV或执行其他操作
        })
            .catch(err => {
            console.error('Error reading from clipboard: ', err);
        });
    });








    // 创建一个函数来添加CSS2样式
    let stylesAdded = false;

    // 创建一个函数来添加CSS样式
    function addCSS(cssContent, identifier) {
        if (!stylesAdded) {
            var styleElement = document.createElement('style');
            styleElement.textContent = cssContent;
            styleElement.setAttribute('data-identifier', identifier);
            document.head.appendChild(styleElement);
            stylesAdded = true;
        }
    }

    // Add custom style using GM_addstylecss 強制使用格式
    let customBackgroundColor61 = "#120903";
    let customBackgroundColor62 = "#5e2802";
    GM_addStyle(".tradingview-popup-script61{background-color: " + customBackgroundColor61 + " !important }");
    GM_addStyle(".tradingview-popup-script62{background-color: " + customBackgroundColor62 + " !important }");

    // Add CSS stylecsss for the popup
    addCSS(`
        .tradingview-popup-script61{
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-56%, -40%);
            background-color: #1c0909;
            border: 1px solid #262626;
            padding: 10px;
            z-index: auto;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            border-Radius: 8px;
            cursor: move; /* 添加拖动时的鼠标样式 */
        }
    `, 'tradingview-popup-scrip61');

    // Create a function to add the TradingView widget
    function addTradingViewWidget() {
        var container = document.createElement('div');
        container.className = 'tradingview-popup-script61';
        container.innerHTML = `
            <div class="tradingview-widget-container61" >
                <div class="tradingview-widget-container__widget" ></div>
                <div class="tradingview-widget-copyright">
                    <a href="https://www.tradingview.com/widget-docs/widgets/charts/advanced-chart/" rel="noopener nofollow" target="_blank">
                    <span class="blue-text">Track all markets on TradingView</span>
                    </a>
                </div>
            </div>
        `;

        document.body.appendChild(container);

        // Load the TradingView widget script
        var script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
        script.async = true;
        // 将 "${idTV}" 插入到 symbol 字段中
        script.innerHTML = `
           {
            "autosize": true,
            "symbol": "${idTV}",
            "interval": "W",
            "timezone": "Etc/UTC",
            "theme": "dark",
            "style": "1",
            "locale": "en",
            "enable_publishing": false,
            "withdateranges": true,
            "allow_symbol_change": true,
            "calendar": false,
            "width": "600",
            "height": "400",
            "support_host": "https://www.tradingview.com"
          }
        `;
        container.appendChild(script);

        // Add event listeners for clicking
        container.addEventListener('click', function() {
            container.style.zIndex = getMaxZIndex() + 1;
        });

        // 獲取文檔中最高的z-index值
        function getMaxZIndex() {
            var elements = document.getElementsByTagName('*');
            var maxIndex = 0;
            for (var i = 0; i < elements.length; i++) {
                var zIndex = parseInt(window.getComputedStyle(elements[i]).zIndex);
                if (!isNaN(zIndex) && zIndex > maxIndex) {
                    maxIndex = zIndex;
                }
            }
            return maxIndex;
        }

        // Add event listeners for dragging
        var offsetX, offsetY, isDragging = false;
        container.addEventListener('mousedown', function(e) {
            isDragging = true;
            offsetX = e.clientX - container.offsetLeft;
            offsetY = e.clientY - container.offsetTop;
        });
        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                container.style.left = e.clientX - offsetX + 'px';
                container.style.top = e.clientY - offsetY + 'px';
            }
        });
        document.addEventListener('mouseup', function() {
            isDragging = false;
        });

        // Create a function to toggle the CSS window size
        function toggleCSSWindowSize() {
            if (container.style.width === '350px') {
                container.style.width = '980px';
                container.style.height = '610px';
            } else {
                container.style.width = '600px';
                container.style.height = '400px';
            }
        }

        // Create a button to toggle the CSS window size
        var toggleButton = document.createElement('button');
        toggleButton.textContent = 'T';
        toggleButton.style.position = 'absolute';
        toggleButton.style.top = '10px';
        toggleButton.style.right = '10px';
        toggleButton.style.zIndex = '10000'; // 修正了z-index值
        toggleButton.addEventListener('click', toggleCSSWindowSize);
        // Add the button to the container
        container.appendChild(toggleButton);

        // Create a function to hide the CSS window
        function hideCSSWindow() {
            container.style.display = 'none';
            document.body.appendChild(restoreButton);
        }

        // Create a button to hide the CSS window
        var hideButton = document.createElement('button');
        hideButton.textContent = 'H';
        hideButton.style.position = 'absolute';
        hideButton.style.top = '10px';
        hideButton.style.right = '40px';
        hideButton.style.zIndex = '10000'; // 修正了z-index值
        hideButton.addEventListener('click', hideCSSWindow);
        hideButton.style.backgroundColor = customBackgroundColor62;
        // Add the button to the container
        container.appendChild(hideButton);

        // Create a function to restore the CSS window
        function restoreCSSWindow() {
            container.style.display = 'block';
            document.body.removeChild(restoreButton);
        }

        // Create a button to restore the CSS window
        var restoreButton = document.createElement('button');
        restoreButton.textContent = 'LIT';
        restoreButton.style.position = 'absolute';
        restoreButton.style.bottom = '10px';
        restoreButton.style.left = '282px';
        restoreButton.style.zIndex = '10000'; // 修正了z-index值
        restoreButton.addEventListener('click', restoreCSSWindow);
        restoreButton.style.borderRadius = '8px';
        restoreButton.style.backgroundColor = customBackgroundColor62;
        // Add the button to the container
        container.appendChild(restoreButton);

        // Hide the CSS window when it's created
        hideCSSWindow();
    }

    // Call the function to add the TradingView widget
    addTradingViewWidget();
})();
