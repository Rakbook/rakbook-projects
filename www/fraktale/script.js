const docSlider = (function() {
    let $options = {};
    const f = {};
    const b = document.getElementsByTagName("html")[0];
    const a = {
        speed: 600,
        startSpeed: null,
        easing: "ease",
        pager: true,
        horizontal: false,
        complete: function(g) {},
        beforeChange: function(g, l, m, j, h) {},
        afterChange: function(g, l, j, m, h) {}
    };
    const e = {
        enable: true,
        wheelEnable: true,
        ticking: false,
        timer: null,
        type: null,
        pastType: null,
        pastIndex: 0,
        currentIndex: 0,
        onWheel: "onwheel"in document ? "wheel" : "onmousewheel"in document ? "mousewheel" : "DOMMouseScroll",
        fromPoint: "elementsFromPoint"in document ? "elementsFromPoint" : "msElementsFromPoint",
        hash: location.hash,
        id: [],
        page: [],
        i: [],
        isIOSChrome: /crios/.test(navigator.userAgent.toLocaleLowerCase()),
        isTouchDeice: ("maxTouchPoints"in navigator) ? navigator.maxTouchPoints : false,
        touch: {
            XY: "Y",
            distance: false,
            start: {
                X: null,
                Y: null
            },
            move: {
                X: null,
                Y: null
            },
            pastMove: {
                X: null,
                Y: null
            }
        },
        distance: {
            top: {
                Y: "top",
                X: "left"
            },
            bottom: {
                Y: "bottom",
                X: "right"
            }
        }
    };
    f.wrapper = document.querySelector(".docSlider");
    f.pages = document.querySelectorAll(".docSlider > *:not(.docSlider-pager)");
    f.pager = document.querySelector(".docSlider-pager");
    f.inner = document.createElement("div");
    f.inner.classList.add("docSlider-inner");
    for (let i = 0; i < f.pages.length; i++) {
        (function(g) {
            const h = f.pages[g];
            e.page[g] = "page_" + (g + 1);
            e.id[g] = h.getAttribute("id") ? "id_" + h.getAttribute("id") : "id_";
            e.i[g] = "index_" + g;
            h.classList.add("docSlider-page");
            h.classList.add("docSlider-scroll");
            h.setAttribute("data-ds-index", g);
            h.setAttribute("tabindex", 0);
            f.inner.appendChild(h)
        }
        )(i)
    }
    f.wrapper.appendChild(f.inner);
    if (!f.pager) {
        f.pager = document.createElement("nav");
        f.pager.classList.add("docSlider-pager");
        //
        let descriptions = ["Strona główna ", "O fraktalach ", "MójFraktal "];
        //
        for (let i = 0; i < f.pages.length; i++) {
            (function(g) {


                let buttons = document.createElement("button");
                buttons.classList.add("docSlider-button");
                buttons.style = "display: inline";
                buttons.setAttribute("tabindex", "-1");
                //f.pager.appendChild(buttons)

                /// new code
                let div = document.createElement("div");
                div.classList.add("dotTitle");
                let texts = document.createElement("span");
                texts.style = "display: inline";
                texts.innerHTML = descriptions[i];
                div.appendChild(texts);
                div.appendChild(buttons);
                f.pager.appendChild(div);
                /// new code

            }
            )(i)
        }
        f.wrapper.appendChild(f.pager);
        f.buttons = document.querySelectorAll(".docSlider-button");
    } else {
        f.buttons = document.querySelectorAll(".docSlider-button");
        for (let i = 0; i < f.buttons.length; i++) {
            (function(g) {
                f.buttons[g].setAttribute("tabindex", "-1")
            }
            )(i)
        }
    }
    b.classList.add(e.page[0]);
    b.classList.add(e.i[0]);
    b.classList.add(e.id[0]);
    f.buttons[0].classList.add("active");
    f.pages[0].focus();
    const d = {
        setCommon: function() {
            for (let i = 0; i < f.pages.length; i++) {
                (function(h) {
                    const j = f.pages[h];
                    const g = f.buttons[h];
                    j.addEventListener("focusin", {
                        i: h,
                        handleEvent: d.tabFocus
                    });
                    g.addEventListener("click", {
                        i: h,
                        handleEvent: d.btnClick
                    })
                }
                )(i)
            }
            document.addEventListener("keyup", d.keyup);
            f.wrapper.addEventListener(e.onWheel, d.wheel)
        },
        setMobile: function() {
            e.touch.XY = $options.horizontal ? "X" : "Y";
            if (e.isTouchDeice) {
                f.inner.addEventListener("touchstart", d.touchstart, false);
                f.inner.addEventListener("touchmove", d.touchmove, false);
                f.inner.addEventListener("touchend", d.touchend, false)
            }
        },
        tabFocus: function() {
            if (!e.enable) {
                return false
            }
            c.jump(this.i, $options.speed, $options.easing)
        },
        btnClick: function() {
            if (!e.enable) {
                return false
            }
            e.type = "pager";
            f.pages[this.i].focus()
        },
        keyup: function(l) {
            if (!e.enable) {
                return false
            }
            const h = e.currentIndex;
            const m = f.pages[e.currentIndex];
            const j = l.key;
            const g = l.shiftKey;
            let jumpTo = false;
            if (document.activeElement !== f.pages[e.currentIndex]) {
                return false
            }
            if (g) {
                if (/ |Spacebar/.test(j) && c.isScrollEnd(m, "top") && h > 0) {
                    jumpTo = h - 1
                }
            } else {
                if (/ |Spacebar|ArrowDown|Down|pageDown/.test(j) && c.isScrollEnd(m, "bottom") && h !== f.pages.length - 1) {
                    jumpTo = h + 1
                } else {
                    if (/ArrowUp|Up|pageUp/.test(j) && c.isScrollEnd(m, "top") && h > 0) {
                        jumpTo = h - 1
                    } else {
                        if (/Home/.test(j) && h !== 0) {
                            jumpTo = 0
                        } else {
                            if (/End/.test(j) && h !== f.pages.length - 1) {
                                jumpTo = f.pages.length - 1
                            }
                        }
                    }
                }
                if ($options.horizontal) {
                    if (/ArrowLeft|Left/.test(j) && h !== 0) {
                        jumpTo = h - 1
                    } else {
                        if (/ArrowRight|Right/.test(j) && h !== f.pages.length - 1) {
                            jumpTo = h + 1
                        }
                    }
                }
            }
            if (jumpTo !== false) {
                e.type = "key";
                f.pages[jumpTo].focus()
            }
        },
        wheel: function(g) {
            if (!e.enable) {
                return false
            }
            if (!e.ticking && e.wheelEnable) {
                requestAnimationFrame(function() {
                    e.wheelEnable = false;
                    e.ticking = false;
                    const m = g.deltaY ? -(g.deltaY) : g.wheelDelta ? g.wheelDelta : -(g.detail);
                    const j = document[e.fromPoint](g.pageX, g.pageY);
                    const l = m > 0 ? "top" : "bottom";
                    const h = l === "top" ? c.toIndex(e.currentIndex - 1) : c.toIndex(e.currentIndex + 1);
                    if (h === e.currentIndex) {
                        e.wheelEnable = true;
                        return false
                    }
                    for (let i = 0; i < j.length; i++) {
                        if (j[i].classList.contains("docSlider-scroll") && !c.isScrollEnd(j[i], l)) {
                            e.wheelEnable = true;
                            return false
                        }
                    }
                    e.type = "scroll";
                    f.pages[h].focus()
                });
                e.ticking = true
            }
        },
        touchstart: function(g) {
            if (!e.enable) {
                return false
            }
            e.touch.start.Y = g.touches[0].pageY;
            e.touch.start.X = g.touches[0].pageX;
            e.touch.move.Y = e.touch.start.Y;
            e.touch.move.X = e.touch.start.X;
            e.touch.pastMove.Y = e.touch.start.Y;
            e.touch.pastMove.X = e.touch.start.X
        },
        touchmove: function(g) {
            if (!e.enable) {
                return false
            }
            if (g.touches.length > 1) {
                g.preventDefault()
            }
            e.touch.pastMove.Y = e.touch.move.Y;
            e.touch.pastMove.X = e.touch.move.X;
            e.touch.move.Y = g.changedTouches[0].pageY;
            e.touch.move.X = g.changedTouches[0].pageX;
            if (e.touch.move[e.touch.XY] > e.touch.pastMove[e.touch.XY]) {
                e.touch.distance = e.distance.top[[e.touch.XY]]
            } else {
                e.touch.distance = e.distance.bottom[[e.touch.XY]]
            }
        },
        touchend: function(j) {
            if (!e.enable) {
                return false
            }
            const h = document[e.fromPoint](e.touch.start.X, e.touch.start.Y);
            const g = e.touch.distance === e.distance.top[[e.touch.XY]] ? c.toIndex(e.currentIndex - 1) : c.toIndex((e.currentIndex + 1));
            if (e.touch.move[e.touch.XY] === e.touch.pastMove[e.touch.XY]) {
                return false
            }
            if ($options.horizontal) {
                if (Math.abs(e.touch.start.Y - e.touch.move.Y) > Math.abs(e.touch.start.X - e.touch.move.X)) {
                    return false
                }
            } else {
                if (Math.abs(e.touch.start.X - e.touch.move.X) > Math.abs(e.touch.start.Y - e.touch.move.Y)) {
                    return false
                }
            }
            if (!c.isScrollEnd(f.pages[e.currentIndex], e.touch.distance)) {
                return false
            }
            for (let i = 0; i < h.length; i++) {
                if (h[i].classList.contains("docSlider-scroll") && !c.isScrollEnd(h[i], e.touch.distance)) {
                    e.wheelEnable = true;
                    return false
                }
            }
            e.type = "scroll";
            f.pages[g].focus()
        }
    };
    const c = {
        setOptions: function(h, g) {
            let resultOptions = {};
            if (typeof h === "undefined") {
                return
            }
            Object.keys(h).forEach(function(j) {
                if (Object.prototype.toString.call(h[j]) === "[object Object]") {
                    resultOptions[j] = c.setOptions(h[j], g[j])
                } else {
                    resultOptions[j] = h[j];
                    if (typeof g !== "undefined" && typeof g[j] !== "undefined") {
                        resultOptions[j] = g[j]
                    }
                }
            });
            return resultOptions
        },
        jump: function(g, j, m) {
            if (e.currentIndex !== g) {
                const h = typeof j === "undefined" ? $options.speed : j;
                const l = typeof m === "undefined" ? $options.easing : m;
                e.type = e.type ? e.type : "tab";
                e.pastType = e.type;
                e.pastIndex = e.currentIndex;
                e.currentIndex = g;
                $options.beforeChange(e.pastIndex, f.pages[e.pastIndex], e.currentIndex, f.pages[e.currentIndex], e.type);
                e.type = null;
                c.setCss(g, h, l);
                c.pagerUpdate();
                c.classUpdate();
                if (RegExp("anchor|jumpPage|nextPage|prevPage").test(e.pastType)) {
                    f.pages[e.currentIndex].focus()
                }
                clearTimeout(e.timer);
                e.timer = setTimeout(function() {
                    e.wheelEnable = true;
                    $options.afterChange(e.currentIndex, f.pages[e.currentIndex], e.pastIndex, f.pages[e.pastIndex], e.pastType)
                }, h)
            } else {
                e.wheelEnable = true
            }
        },
        setCss: function(g, h, j) {
            for (let k = 0; k < f.pages.length; k++) {
                f.pages[k].style.transitionTimingFunction = j;
                f.pages[k].style.transitionDuration = h + "ms";
                if ($options.horizontal) {
                    f.pages[k].style.position = "absolute";
                    f.pages[k].style.marginLeft = (k * 100) + "%";
                    if (e.isIOSChrome) {
                        f.pages[k].style.left = "-" + (100 * g) + "%"
                    } else {
                        f.pages[k].style.transform = "translateX(-" + 100 * g + "%)"
                    }
                } else {
                    if (e.isIOSChrome) {
                        f.pages[k].style.top = "-" + (100 * g) + "%"
                    } else {
                        f.pages[k].style.transform = "translateY(-" + 100 * g + "%)"
                    }
                }
            }
        },
        toIndex: function(g) {
            if (isNaN(g)) {
                const h = document.getElementById(g.replace("#", ""));
                return h ? h.getAttribute("data-ds-index") ? Number(h.getAttribute("data-ds-index")) : 0 : 0
            } else {
                return g < 0 ? 0 : g > f.pages.length - 1 ? f.pages.length - 1 : g
            }
        },
        isScrollEnd: function(g, h) {
            let result;
            switch (h) {
            case "top":
                result = g.scrollTop <= 0;
                break;
            case "bottom":
                result = g.scrollTop >= g.scrollHeight - g.clientHeight;
                break;
            case "left":
                result = g.scrollLeft <= 0;
                break;
            case "right":
                result = g.scrollLeft >= g.scrollWidth - g.clientWidth;
                break;
            default:
                result = false
            }
            return result
        },
        pagerUpdate: function() {
            for (let i = 0; i < f.buttons.length; i++) {
                (function(g) {
                    f.buttons[g].classList.remove("active")
                }
                )(i)
            }
            f.buttons[e.currentIndex].classList.add("active")
        },
        classUpdate: function() {
            b.classList.remove(e.page[e.pastIndex]);
            b.classList.remove(e.i[e.pastIndex]);
            b.classList.remove(e.id[e.pastIndex]);
            b.classList.add(e.page[e.currentIndex]);
            b.classList.add(e.i[e.currentIndex]);
            b.classList.add(e.id[e.currentIndex])
        }
    };
    return {
        init: function(g) {
            $options = c.setOptions(a, g);
            if (!$options.pager) {
                f.pager.style.display = "none"
            }
            c.setCss(0, $options.speed, $options.easing);
            d.setCommon();
            d.setMobile();
            window.addEventListener("load", function() {
                if (e.hash) {
                    let spd = $options.startSpeed === null ? $options.speed : $options.startSpeed;
                    e.type = "anchor";
                    c.jump(c.toIndex(e.hash), spd)
                }
                $options.complete($options)
            })
        },
        jumpPage: function(m, h, l) {
            const g = h ? h : $options.speed;
            const j = l ? l : $options.easing;
            e.type = "jumpPage";
            c.jump(c.toIndex(m), g, j)
        },
        nextPage: function(h, l) {
            const g = h ? h : $options.speed;
            const j = l ? l : $options.easing;
            e.type = "nextPage";
            c.jump(c.toIndex(e.currentIndex + 1), g, j)
        },
        prevPage: function(h, l) {
            const g = h ? h : $options.speed;
            const j = l ? l : $options.easing;
            e.type = "prevPage";
            c.jump(c.toIndex(e.currentIndex - 1), g, j)
        },
        getOptions: function() {
            return $options
        },
        getElements: function() {
            return f
        },
        getCurrentIndex: function() {
            return e.currentIndex
        },
        getCurrentPage: function() {
            return f.pages[e.currentIndex]
        },
        enable: function(h) {
            const j = typeof h === "undefined" ? true : h;
            const g = j ? "0" : "-1";
            e.enable = j;
            for (let i = 0; i < f.pages.length; i++) {
                f.pages[i].setAttribute("tabindex", g)
            }
        }
    }
}
)();
