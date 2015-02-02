(function() {
    top !== window && (alert("For security reasons, framing is not allowed."), top.location.replace(document.location))
}).call(this),
    function() {
        var t, e;
        t = function() {
            return Promise.resolve($.ajax("/sessions/in_sudo.json"))
        }, e = function() {
            return $.facebox({
                div: "#js-sudo-prompt"
            }, "sudo").then(function(t) {
                return new Promise(function(e, n) {
                    var i, s;
                    return s = null, i = $(t).find(".js-sudo-form"), i.find(".js-sudo-login, .js-sudo-password").first().focus(), i.on("ajaxSuccess", function() {
                        return s = !0, $(document).trigger("close.facebox")
                    }), i.on("ajaxError", function() {
                        return s = !1, $(this).find(".js-sudo-error").text("Incorrect Password.").show(), $(this).find(".js-sudo-password").val(""), !1
                    }), $(document).one("afterClose.facebox", function() {
                        return s ? e(!0) : n(new Error("sudo prompt canceled"))
                    })
                })
            })
        }, $.sudo = function() {
            return t().then(function(t) {
                return t || e()
            })
        }, $(document).on("click", ".js-sudo-required", function() {
            return $.sudo().then(function(t) {
                return function() {
                    return location.href = t.href
                }
            }(this)), !1
        })
    }.call(this),
    function() {
        null == window.GitHub && (window.GitHub = {})
    }.call(this),
    function(t) {
        t.fn.caret = function(t) {
            return "undefined" == typeof t ? this[0].selectionStart : (this[0].focus(), this[0].setSelectionRange(t, t))
        }, t.fn.caretSelection = function(t, e) {
            return "undefined" == typeof t && "undefined" == typeof e ? [this[0].selectionStart, this[0].selectionEnd] : (this[0].focus(), this[0].setSelectionRange(t, e))
        }
    }(jQuery), DateInput = function(t) {
        function e(n, i) {
            "object" != typeof i && (i = {}), t.extend(this, e.DEFAULT_OPTS, i), this.input = t(n), this.bindMethodsToObj("show", "hide", "hideIfClickOutside", "keydownHandler", "selectDate"), this.build(), this.selectDate(), this.show(), this.input.hide(), this.input.data("datePicker", this)
        }
        return e.DEFAULT_OPTS = {
            month_names: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            short_month_names: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            short_day_names: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            start_of_week: 1
        }, e.prototype = {
            build: function() {
                var e = t('<p class="month_nav"><span class="date-button prev" title="[Page-Up]">\u25c0</span> <span class="js-month-name"></span> <span class="date-button next" title="[Page-Down]">\u25b6</span></p>');
                this.monthNameSpan = t(".js-month-name", e), t(".prev", e).click(this.bindToObj(function() {
                    this.moveMonthBy(-1)
                })), t(".next", e).click(this.bindToObj(function() {
                    this.moveMonthBy(1)
                }));
                var n = t('<p class="year_nav"><span class="date-button prev" title="[Ctrl+Page-Up]">\u25c0</span> <span class="js-year-name"></span> <span class="date-button next" title="[Ctrl+Page-Down]">\u25b6</span></p>');
                this.yearNameSpan = t(".js-year-name", n), t(".prev", n).click(this.bindToObj(function() {
                    this.moveMonthBy(-12)
                })), t(".next", n).click(this.bindToObj(function() {
                    this.moveMonthBy(12)
                }));
                var i = t("<div></div>").append(e, n),
                    s = "<table><thead><tr>";
                t(this.adjustDays(this.short_day_names)).each(function() {
                    s += "<th>" + this + "</th>"
                }), s += "</tr></thead><tbody></tbody></table>", this.dateSelector = this.rootLayers = t('<div class="date_selector"></div>').append(i, s).insertAfter(this.input), this.tbody = t("tbody", this.dateSelector), this.input.change(this.bindToObj(function() {
                    this.selectDate()
                })), this.selectDate()
            },
            selectMonth: function(e) {
                var n = new Date(e.getFullYear(), e.getMonth(), 1);
                if (!this.currentMonth || this.currentMonth.getFullYear() != n.getFullYear() || this.currentMonth.getMonth() != n.getMonth()) {
                    this.currentMonth = n;
                    for (var i = this.rangeStart(e), s = this.rangeEnd(e), a = this.daysBetween(i, s), r = "", o = 0; a >= o; o++) {
                        var c = new Date(i.getFullYear(), i.getMonth(), i.getDate() + o, 12, 0);
                        this.isFirstDayOfWeek(c) && (r += "<tr>"), r += c.getMonth() == e.getMonth() ? '<td class="selectable_day" date="' + this.dateToString(c) + '">' + c.getDate() + "</td>" : '<td class="unselected_month" date="' + this.dateToString(c) + '">' + c.getDate() + "</td>", this.isLastDayOfWeek(c) && (r += "</tr>")
                    }
                    this.tbody.empty().append(r), this.monthNameSpan.empty().append(this.monthName(e)), this.yearNameSpan.empty().append(this.currentMonth.getFullYear()), t(".selectable_day", this.tbody).mousedown(this.bindToObj(function(e) {
                        this.changeInput(t(e.target).attr("date"))
                    })), t("td[date='" + this.dateToString(new Date) + "']", this.tbody).addClass("today"), t("td.selectable_day", this.tbody).mouseover(function() {
                        t(this).addClass("hover")
                    }), t("td.selectable_day", this.tbody).mouseout(function() {
                        t(this).removeClass("hover")
                    })
                }
                t(".selected", this.tbody).removeClass("selected"),
                    t('td[date="' + this.selectedDateString + '"]', this.tbody).addClass("selected");
            },
            selectDate: function(t) {
                "undefined" == typeof t && (t = this.stringToDate(this.input.val())), t || (t = new Date), this.selectedDate = t, this.selectedDateString = this.dateToString(this.selectedDate), this.selectMonth(this.selectedDate)
            },
            resetDate: function() {
                t(".selected", this.tbody).removeClass("selected"), this.changeInput("")
            },
            changeInput: function(t) {
                this.input.val(t).change(), this.hide()
            },
            show: function() {
                this.rootLayers.css("display", "block"), t([window, document.body]).click(this.hideIfClickOutside), this.input.unbind("focus", this.show), this.rootLayers.keydown(this.keydownHandler), this.setPosition()
            },
            hide: function() {},
            hideIfClickOutside: function(t) {
                t.target == this.input[0] || this.insideSelector(t) || this.hide()
            },
            insideSelector: function(e) {
                return $target = t(e.target), $target.parents(".date_selector").length || $target.is(".date_selector")
            },
            keydownHandler: function(t) {
                switch (t.keyCode) {
                    case 9:
                    case 27:
                        return void this.hide();
                    case 13:
                        this.changeInput(this.selectedDateString);
                        break;
                    case 33:
                        this.moveDateMonthBy(t.ctrlKey ? -12 : -1);
                        break;
                    case 34:
                        this.moveDateMonthBy(t.ctrlKey ? 12 : 1);
                        break;
                    case 38:
                        this.moveDateBy(-7);
                        break;
                    case 40:
                        this.moveDateBy(7);
                        break;
                    case 37:
                        this.moveDateBy(-1);
                        break;
                    case 39:
                        this.moveDateBy(1);
                        break;
                    default:
                        return
                }
                t.preventDefault()
            },
            stringToDate: function(t) {
                var e;
                return (e = t.match(/^(\d{4,4})-(\d{2,2})-(\d{2,2})$/)) ? new Date(e[1], (e[2] - 1), e[3], 12, 0) : null
            },
            dateToString: function(t) {
                return t.getFullYear() + "-" + ("0" + (t.getMonth() + 1)).slice(-2) + "-" + ("0" + t.getDate()).slice(-2)
            },
            setPosition: function() {
                var t = this.input.offset();
                this.rootLayers.css({
                    top: t.top + this.input.outerHeight(),
                    left: t.left
                }), this.ieframe && this.ieframe.css({
                    width: this.dateSelector.outerWidth(),
                    height: this.dateSelector.outerHeight()
                })
            },
            moveDateBy: function(t) {
                var e = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), this.selectedDate.getDate() + t);
                this.selectDate(e)
            },
            moveDateMonthBy: function(t) {
                var e = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth() + t, this.selectedDate.getDate());
                e.getMonth() == this.selectedDate.getMonth() + t + 1 && e.setDate(0), this.selectDate(e)
            },
            moveMonthBy: function(t) {
                var e = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + t, this.currentMonth.getDate());
                this.selectMonth(e)
            },
            monthName: function(t) {
                return this.month_names[t.getMonth()]
            },
            bindToObj: function(t) {
                var e = this;
                return function() {
                    return t.apply(e, arguments)
                }
            },
            bindMethodsToObj: function() {
                for (var t = 0; t < arguments.length; t++) this[arguments[t]] = this.bindToObj(this[arguments[t]])
            },
            indexFor: function(t, e) {
                for (var n = 0; n < t.length; n++)
                    if (e == t[n]) return n
            },
            monthNum: function(t) {
                return this.indexFor(this.month_names, t)
            },
            shortMonthNum: function(t) {
                return this.indexFor(this.short_month_names, t)
            },
            shortDayNum: function(t) {
                return this.indexFor(this.short_day_names, t)
            },
            daysBetween: function(t, e) {
                return t = Date.UTC(t.getFullYear(), t.getMonth(), t.getDate()), e = Date.UTC(e.getFullYear(), e.getMonth(), e.getDate()), (e - t) / 864e5
            },
            changeDayTo: function(t, e, n) {
                var i = n * (Math.abs(e.getDay() - t - 7 * n) % 7);
                return new Date(e.getFullYear(), e.getMonth(), e.getDate() + i)
            },
            rangeStart: function(t) {
                return this.changeDayTo(this.start_of_week, new Date(t.getFullYear(), t.getMonth()), -1)
            },
            rangeEnd: function(t) {
                return this.changeDayTo((this.start_of_week - 1) % 7, new Date(t.getFullYear(), t.getMonth() + 1, 0), 1)
            },
            isFirstDayOfWeek: function(t) {
                return t.getDay() == this.start_of_week
            },
            isLastDayOfWeek: function(t) {
                return t.getDay() == (this.start_of_week - 1) % 7
            },
            adjustDays: function(t) {
                for (var e = [], n = 0; n < t.length; n++) e[n] = t[(n + this.start_of_week) % 7];
                return e
            }
        }, e
    }(jQuery),
    function(t) {
        t.fn.errorify = function(e, n) {
            t.extend({}, t.fn.errorify.defaults, n);
            return this.each(function() {
                var n = t(this);
                n.removeClass("warn"), n.addClass("errored"), n.find("p.note").hide(), n.find("dd.error").remove(), n.find("dd.warning").remove();
                var i = t("<dd>").addClass("error").text(e);
                n.append(i)
            })
        }, t.fn.errorify.defaults = {}, t.fn.unErrorify = function(e) {
            t.extend({}, t.fn.unErrorify.defaults, e);
            return this.each(function() {
                var e = t(this);
                e.removeClass("errored warn"), e.find("p.note").show(), e.find("dd.error").remove(), e.find("dd.warning").remove()
            })
        }, t.fn.unErrorify.defaults = {}
    }(jQuery),
    function() {
        var t, e;
        t = function(t) {
            return Error.call(this), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = (new Error).stack, this.name = "DataRemoteError", this.message = t
        }, t.prototype = new Error, t.prototype.constructor = t, e = function() {
            return $("#ajax-error-message").show(function() {
                return $(this).addClass("visible")
            })
        }, $(document).on("ajaxError", "[data-remote]", function(n, i, s, a) {
            var r, o, c, l, u, d, h;
            if (this === n.target && "abort" !== a) {
                if (o = "." + this.className.split(" ").sort().join("."), r = new t("" + a + " (" + i.status + ") from " + o), r.failbotContext = {
                        dataRemote: {
                            target: $(this).inspect(),
                            method: null != (c = null != (l = this.getAttribute("data-method")) ? l : this.getAttribute("method")) ? c : "GET",
                            url: null != (u = null != (d = this.href) ? d : this.action) ? u : window.location.href,
                            dataType: null != (h = this.getAttribute("data-type")) ? h : "intelligent guess"
                        }
                    }, /<html/.test(i.responseText)) throw e(), n.stopImmediatePropagation(), r;
                return setTimeout(function() {
                    if (!n.isDefaultPrevented()) throw e(), r
                }, 0)
            }
        }), $(document).on("ajaxBeforeSend", "[data-remote]", function() {
            return $("#ajax-error-message").hide().removeClass("visible")
        }), $(document).on("click", ".js-ajax-error-dismiss", function() {
            return $("#ajax-error-message").hide().removeClass("visible"), !1
        })
    }.call(this),
    function() {
        $(document).on("ajaxSend", "[data-remote]", function(t) {
            return this !== t.target || t.isDefaultPrevented() ? void 0 : $(this).addClass("loading")
        }), $(document).on("ajaxComplete", "[data-remote]", function(t) {
            return this === t.target ? $(this).removeClass("loading") : void 0
        })
    }.call(this),
    function() {
        var t, e, n, i;
        i = new WeakMap, e = new WeakMap, n = function(t) {
            return $.param(t).split("&").sort().join("&")
        }, t = function(t) {
            var s, a, r, o, c, l, u;
            s = $(t), c = s.val(), a = !$.trim(c), o = {
                type: "POST",
                url: t.getAttribute("data-autocheck-url"),
                data: {
                    value: c
                }
            }, r = $.Event("autocheck:send"), a || s.trigger(r, o), r.isDefaultPrevented() || n(o.data) !== e.get(t) && (s.closest("dl.form").removeClass("errored successed"), s.removeClass("is-autocheck-successful is-autocheck-errored"), null != (u = i.get(t)) && u.abort(), a || (s.addClass("is-autocheck-loading"), s.closest("dl.form").addClass("is-loading"), e.set(t, n(o.data)), l = $.ajax(o).done(function() {
                return s.addClass("is-autocheck-successful"), s.closest("dl.form").unErrorify().addClass("successed"), s.trigger("autocheck:success", arguments)
            }).fail(function(t, e) {
                return "abort" !== e && s.is($.visible) ? (s.addClass("is-autocheck-errored"), s.closest("dl.form").errorify(/<html/.test(t.responseText) ? "Something went wrong." : t.responseText), s.trigger("autocheck:error", arguments)) : void 0
            }).always(function(t, e) {
                return "abort" !== e ? (s.removeClass("is-autocheck-loading"), s.closest("dl.form").removeClass("is-loading"), s.trigger("autocheck:complete", arguments)) : void 0
            }), i.set(t, l)))
        }, $(document).on("change", "input[data-autocheck-url]", function() {
            return t(this)
        }), $(document).onFocusedInput("input[data-autocheck-url]", function(e) {
            return $(this).on("throttled:input." + e, function() {
                return t(this)
            }), !1
        })
    }.call(this),
    function() {
        var t, e = function(t, e) {
            return function() {
                return t.apply(e, arguments)
            }
        };
        new(t = function() {
            function t() {
                this.onNavigationOpen = e(this.onNavigationOpen, this), this.onNavigationKeyDown = e(this.onNavigationKeyDown, this), this.onResultsChange = e(this.onResultsChange, this), this.onInputChange = e(this.onInputChange, this), this.onResultsMouseDown = e(this.onResultsMouseDown, this), this.onInputBlur = e(this.onInputBlur, this), this.onInputFocus = e(this.onInputFocus, this);
                var t;
                this.focusedInput = this.focusedResults = null, this.mouseDown = !1, t = this, $(document).focused("input[data-autocomplete]")["in"](function() {
                    return t.onInputFocus(this)
                })
            }
            return t.prototype.bindEvents = function(t, e) {
                return $(t).on("blur", this.onInputBlur), $(t).on("throttled:input", this.onInputChange), $(e).on("mousedown", this.onResultsMouseDown), $(e).on("autocomplete:change", this.onResultsChange), $(e).on("navigation:open", "[data-autocomplete-value]", this.onNavigationOpen), $(e).on("navigation:keydown", "[data-autocomplete-value]", this.onNavigationKeyDown)
            }, t.prototype.unbindEvents = function(t, e) {
                return $(t).off("blur", this.onInputBlur), $(t).off("throttled:input", this.onInputChange), $(e).off("mousedown", this.onResultsMouseDown), $(e).off("autocomplete:change", this.onResultsChange), $(e).off("navigation:open", "[data-autocomplete-value]", this.onNavigationOpen), $(e).off("navigation:keydown", "[data-autocomplete-value]", this.onNavigationKeyDown)
            }, t.prototype.onInputFocus = function(t) {
                var e;
                e = document.getElementById($(t).attr("data-autocomplete")), this.focusedInput = t, this.focusedResults = e, this.bindEvents(t, e), $(t).attr("autocomplete", "off"), $(t).trigger("autocomplete:focus"), $(t).trigger("autocomplete:search", [$(t).val()])
            }, t.prototype.onInputBlur = function(t) {
                var e, n;
                e = t.currentTarget, n = this.focusedResults, this.mouseDown || (this.hideResults(), this.inputValue = null, this.focusedInput = this.focusedResults = null, this.unbindEvents(e, n), $(e).trigger("autocomplete:blur"))
            }, t.prototype.onResultsMouseDown = function() {
                var t;
                this.mouseDown = !0, t = function(e) {
                    return function() {
                        return e.mouseDown = !1, $(document).off("mouseup", t)
                    }
                }(this), $(document).on("mouseup", t)
            }, t.prototype.onInputChange = function(t, e) {
                var n;
                n = t.currentTarget, this.inputValue !== e && ($(n).removeAttr("data-autocompleted"), $(n).trigger("autocomplete:autocompleted:changed")), $(n).trigger("autocomplete:change", [e]), $(n).trigger("autocomplete:search", [e])
            }, t.prototype.onResultsChange = function() {
                var t, e;
                e = $(this.focusedInput).val(), t = $(this.focusedResults).find("[data-autocomplete-value]"), 0 === t.length ? this.hideResults() : this.inputValue !== e && (this.inputValue = e, this.showResults(), $(this.focusedInput).is("[data-autocomplete-autofocus]") && $(this.focusedResults).find("ul").navigation("focus"))
            }, t.prototype.onNavigationKeyDown = function(t) {
                switch (t.hotkey) {
                    case "tab":
                        return this.onNavigationOpen(t), !1;
                    case "esc":
                        return this.hideResults(), !1
                }
            }, t.prototype.onNavigationOpen = function(t) {
                var e, n;
                e = t.currentTarget, n = $(e).attr("data-autocomplete-value"), this.inputValue = n, $(this.focusedInput).val(n), $(this.focusedInput).attr("data-autocompleted", n), $(this.focusedInput).trigger("autocomplete:autocompleted:changed", [n]), $(this.focusedInput).trigger("autocomplete:result", [n]), $(e).removeClass("active"), this.hideResults()
            }, t.prototype.showResults = function(t, e) {
                var n, i, s, a, r;
                return null == t && (t = this.focusedInput), null == e && (e = this.focusedResults), $(e).is($.visible) ? void 0 : (r = $(t).offset(), s = r.top, i = r.left, n = s + $(t).innerHeight(), a = $(t).innerWidth(), $(e).css({
                    display: "block",
                    position: "absolute",
                    width: a + 2
                }), $(e).offset({
                    top: n + 5,
                    left: i + 1
                }), $(t).addClass("js-navigation-enable"), $(e).find("ul").navigation("push"), $(e).show())
            }, t.prototype.hideResults = function(t, e) {
                return null == t && (t = this.focusedInput), null == e && (e = this.focusedResults), $(e).is($.visible) ? ($(t).removeClass("js-navigation-enable"), $(e).find("ul").navigation("pop"), $(e).hide()) : void 0
            }, t
        }())
    }.call(this),
    function() {
        $(document).focused(".js-autosearch-field")["in"](function() {
            var t, e, n;
            return t = $(this), e = t.closest("form"), n = $("#" + e.attr("data-results-container")), t.on("throttled:input.autosearch_form", function() {
                var t, i;
                return e.addClass("is-sending"), t = e.prop("action"), i = $.ajax({
                    url: t,
                    data: e.serializeArray(),
                    context: e
                }), i.always(function() {
                    return e.removeClass("is-sending")
                }), i.done(function(t) {
                    return $.support.pjax && window.history.replaceState(null, "", "?" + e.serialize()), n.html(t)
                })
            })
        }).out(function() {
            return $(this).off(".autosearch_form")
        })
    }.call(this),
    function() {
        $(document).on("submit", ".js-braintree-encrypt", function() {
            var t;
            t = Braintree.create($(this).attr("data-braintree-key")), t.encryptForm(this)
        })
    }.call(this),
    function() {
        var t, e, n, i, s, a, r, o, c, l, u, d, h, f, m, p, g, v, $, j = [].slice,
            b = [].indexOf || function(t) {
                for (var e = 0, n = this.length; n > e; e++)
                    if (e in this && this[e] === t) return e;
                return -1
            };
        t = jQuery, t.payment = {}, t.payment.fn = {}, t.fn.payment = function() {
            var e, n;
            return n = arguments[0], e = 2 <= arguments.length ? j.call(arguments, 1) : [], t.payment.fn[n].apply(this, e)
        }, s = /(\d{1,4})/g, i = [{
            type: "maestro",
            pattern: /^(5018|5020|5038|6304|6759|676[1-3])/,
            format: s,
            length: [12, 13, 14, 15, 16, 17, 18, 19],
            cvcLength: [3],
            luhn: !0
        }, {
            type: "dinersclub",
            pattern: /^(36|38|30[0-5])/,
            format: s,
            length: [14],
            cvcLength: [3],
            luhn: !0
        }, {
            type: "laser",
            pattern: /^(6706|6771|6709)/,
            format: s,
            length: [16, 17, 18, 19],
            cvcLength: [3],
            luhn: !0
        }, {
            type: "jcb",
            pattern: /^35/,
            format: s,
            length: [16],
            cvcLength: [3],
            luhn: !0
        }, {
            type: "unionpay",
            pattern: /^62/,
            format: s,
            length: [16, 17, 18, 19],
            cvcLength: [3],
            luhn: !1
        }, {
            type: "discover",
            pattern: /^(6011|65|64[4-9]|622)/,
            format: s,
            length: [16],
            cvcLength: [3],
            luhn: !0
        }, {
            type: "mastercard",
            pattern: /^5[1-5]/,
            format: s,
            length: [16],
            cvcLength: [3],
            luhn: !0
        }, {
            type: "amex",
            pattern: /^3[47]/,
            format: /(\d{1,4})(\d{1,6})?(\d{1,5})?/,
            length: [15],
            cvcLength: [3, 4],
            luhn: !0
        }, {
            type: "visa",
            pattern: /^4/,
            format: s,
            length: [13, 14, 15, 16],
            cvcLength: [3],
            luhn: !0
        }], e = function(t) {
            var e, n, s;
            for (t = (t + "").replace(/\D/g, ""), n = 0, s = i.length; s > n; n++)
                if (e = i[n], e.pattern.test(t)) return e
        }, n = function(t) {
            var e, n, s;
            for (n = 0, s = i.length; s > n; n++)
                if (e = i[n], e.type === t) return e
        }, h = function(t) {
            var e, n, i, s, a, r;
            for (i = !0, s = 0, n = (t + "").split("").reverse(), a = 0, r = n.length; r > a; a++) e = n[a], e = parseInt(e, 10), (i = !i) && (e *= 2), e > 9 && (e -= 9), s += e;
            return s % 10 === 0
        }, d = function(t) {
            var e;
            return null != t.prop("selectionStart") && t.prop("selectionStart") !== t.prop("selectionEnd") ? !0 : ("undefined" != typeof document && null !== document && null != (e = document.selection) && "function" == typeof e.createRange ? e.createRange().text : void 0) ? !0 : !1
        }, f = function(e) {
            return setTimeout(function() {
                var n, i;
                return n = t(e.currentTarget), i = n.val(), i = t.payment.formatCardNumber(i), n.val(i)
            })
        }, o = function(n) {
            var i, s, a, r, o, c, l;
            return a = String.fromCharCode(n.which), !/^\d+$/.test(a) || (i = t(n.currentTarget), l = i.val(), s = e(l + a), r = (l.replace(/\D/g, "") + a).length, c = 16, s && (c = s.length[s.length.length - 1]), r >= c || null != i.prop("selectionStart") && i.prop("selectionStart") !== l.length) ? void 0 : (o = s && "amex" === s.type ? /^(\d{4}|\d{4}\s\d{6})$/ : /(?:^|\s)(\d{4})$/, o.test(l) ? (n.preventDefault(), i.val(l + " " + a)) : o.test(l + a) ? (n.preventDefault(), i.val(l + a + " ")) : void 0)
        }, a = function(e) {
            var n, i;
            return n = t(e.currentTarget), i = n.val(), e.meta || 8 !== e.which || null != n.prop("selectionStart") && n.prop("selectionStart") !== i.length ? void 0 : /\d\s$/.test(i) ? (e.preventDefault(), n.val(i.replace(/\d\s$/, ""))) : /\s\d?$/.test(i) ? (e.preventDefault(), n.val(i.replace(/\s\d?$/, ""))) : void 0
        }, c = function(e) {
            var n, i, s;
            return i = String.fromCharCode(e.which), /^\d+$/.test(i) ? (n = t(e.currentTarget), s = n.val() + i, /^\d$/.test(s) && "0" !== s && "1" !== s ? (e.preventDefault(), n.val("0" + s + " / ")) : /^\d\d$/.test(s) ? (e.preventDefault(), n.val("" + s + " / ")) : void 0) : void 0
        }, l = function(e) {
            var n, i, s;
            return i = String.fromCharCode(e.which), /^\d+$/.test(i) ? (n = t(e.currentTarget), s = n.val(), /^\d\d$/.test(s) ? n.val("" + s + " / ") : void 0) : void 0
        }, u = function(e) {
            var n, i, s;
            return i = String.fromCharCode(e.which), "/" === i ? (n = t(e.currentTarget), s = n.val(), /^\d$/.test(s) && "0" !== s ? n.val("0" + s + " / ") : void 0) : void 0
        }, r = function(e) {
            var n, i;
            if (!e.meta && (n = t(e.currentTarget), i = n.val(), 8 === e.which && (null == n.prop("selectionStart") || n.prop("selectionStart") === i.length))) return /\d(\s|\/)+$/.test(i) ? (e.preventDefault(), n.val(i.replace(/\d(\s|\/)*$/, ""))) : /\s\/\s?\d?$/.test(i) ? (e.preventDefault(), n.val(i.replace(/\s\/\s?\d?$/, ""))) : void 0
        }, v = function(t) {
            var e;
            return t.metaKey || t.ctrlKey ? !0 : 32 === t.which ? !1 : 0 === t.which ? !0 : t.which < 33 ? !0 : (e = String.fromCharCode(t.which), !!/[\d\s]/.test(e))
        }, p = function(n) {
            var i, s, a, r;
            return i = t(n.currentTarget), a = String.fromCharCode(n.which), /^\d+$/.test(a) && !d(i) ? (r = (i.val() + a).replace(/\D/g, ""), s = e(r), s ? r.length <= s.length[s.length.length - 1] : r.length <= 16) : void 0
        }, g = function(e) {
            var n, i, s;
            return n = t(e.currentTarget), i = String.fromCharCode(e.which), /^\d+$/.test(i) && !d(n) ? (s = n.val() + i, s = s.replace(/\D/g, ""), s.length > 6 ? !1 : void 0) : void 0
        }, m = function(e) {
            var n, i, s;
            return n = t(e.currentTarget), i = String.fromCharCode(e.which), /^\d+$/.test(i) ? (s = n.val() + i, s.length <= 4) : void 0
        }, $ = function(e) {
            var n, s, a, r, o;
            return n = t(e.currentTarget), o = n.val(), r = t.payment.cardType(o) || "unknown", n.hasClass(r) ? void 0 : (s = function() {
                var t, e, n;
                for (n = [], t = 0, e = i.length; e > t; t++) a = i[t], n.push(a.type);
                return n
            }(), n.removeClass("unknown"), n.removeClass(s.join(" ")), n.addClass(r), n.toggleClass("identified", "unknown" !== r), n.trigger("payment.cardType", r))
        }, t.payment.fn.formatCardCVC = function() {
            return this.payment("restrictNumeric"), this.on("keypress", m), this
        }, t.payment.fn.formatCardExpiry = function() {
            return this.payment("restrictNumeric"), this.on("keypress", g), this.on("keypress", c), this.on("keypress", u), this.on("keypress", l), this.on("keydown", r), this
        }, t.payment.fn.formatCardNumber = function() {
            return this.payment("restrictNumeric"), this.on("keypress", p), this.on("keypress", o), this.on("keydown", a), this.on("keyup", $), this.on("paste", f), this
        }, t.payment.fn.restrictNumeric = function() {
            return this.on("keypress", v), this
        }, t.payment.fn.cardExpiryVal = function() {
            return t.payment.cardExpiryVal(t(this).val())
        }, t.payment.cardExpiryVal = function(t) {
            var e, n, i, s;
            return t = t.replace(/\s/g, ""), s = t.split("/", 2), e = s[0], i = s[1], 2 === (null != i ? i.length : void 0) && /^\d+$/.test(i) && (n = (new Date).getFullYear(), n = n.toString().slice(0, 2), i = n + i), e = parseInt(e, 10), i = parseInt(i, 10), {
                month: e,
                year: i
            }
        }, t.payment.validateCardNumber = function(t) {
            var n, i;
            return t = (t + "").replace(/\s+|-/g, ""), /^\d+$/.test(t) ? (n = e(t), n ? (i = t.length, b.call(n.length, i) >= 0 && (n.luhn === !1 || h(t))) : !1) : !1
        }, t.payment.validateCardExpiry = function(e, n) {
            var i, s, a, r;
            return "object" == typeof e && "month" in e && (r = e, e = r.month, n = r.year), e && n ? (e = t.trim(e), n = t.trim(n), /^\d+$/.test(e) && /^\d+$/.test(n) && parseInt(e, 10) <= 12 ? (2 === n.length && (a = (new Date).getFullYear(), a = a.toString().slice(0, 2), n = a + n), s = new Date(n, e), i = new Date, s.setMonth(s.getMonth() - 1), s.setMonth(s.getMonth() + 1, 1), s > i) : !1) : !1
        }, t.payment.validateCardCVC = function(e, i) {
            var s, a;
            return e = t.trim(e), /^\d+$/.test(e) ? i ? (s = e.length, b.call(null != (a = n(i)) ? a.cvcLength : void 0, s) >= 0) : e.length >= 3 && e.length <= 4 : !1
        }, t.payment.cardType = function(t) {
            var n;
            return t ? (null != (n = e(t)) ? n.type : void 0) || null : null
        }, t.payment.formatCardNumber = function(t) {
            var n, i, s, a;
            return (n = e(t)) ? (s = n.length[n.length.length - 1], t = t.replace(/\D/g, ""), t = t.slice(0, +s + 1 || 9e9), n.format.global ? null != (a = t.match(n.format)) ? a.join(" ") : void 0 : (i = n.format.exec(t), null != i && i.shift(), null != i ? i.join(" ") : void 0)) : t
        }
    }.call(this),
    function() {
        var t, e = [].indexOf || function(t) {
            for (var e = 0, n = this.length; n > e; e++)
                if (e in this && this[e] === t) return e;
            return -1
        };
        $.observe(".js-card-select-number-field", function() {
            $(this).payment("formatCardNumber")
        }), $.observe(".js-card-cvv", function() {
            $(this).payment("formatCardCVC")
        }), $.observe(".js-card-select-number-field", function() {
            var t, e, n;
            e = $(this).closest("form"), t = e.find(".js-card"), n = e.find(".js-card-select-type-field"), $(this).on("input", function() {
                var e, i, s, a, r;
                if (s = $(this).val(), i = $.payment.cardType(s))
                    for (a = 0, r = t.length; r > a; a++) e = t[a], $(e).toggleClass("enabled", $(e).attr("data-name") === i), $(e).toggleClass("disabled", $(e).attr("data-name") !== i);
                else t.removeClass("enabled disabled");
                n.val(i)
            })
        }), $(document).on("blur", ".js-card-select-number-field", function() {
            return $(this).val($.payment.formatCardNumber($(this).val()))
        }), $(document).on("click", ".js-card", function() {
            var t, e;
            return t = $(this).closest("form"), e = t.find(".js-card-select-number-field"), e.focus()
        }), $(document).on("click", ".js-enter-new-card", function(t) {
            var e, n;
            return e = $(this).closest(".js-setup-creditcard"), n = e.find(".js-card-select-number-field"), e.removeClass("has-credit-card"), n.attr("required", "required"), n.attr("data-encrypted-name", "billing[credit_card][number]"), t.preventDefault()
        }), $(document).on("click", ".js-cancel-enter-new-card", function(t) {
            var e, n;
            return e = $(this).closest(".js-setup-creditcard"), n = e.find(".js-card-select-number-field"), e.addClass("has-credit-card"), n.removeAttr("required"), n.removeAttr("data-encrypted-name"), t.preventDefault()
        }), t = function(t) {
            var n, i, s, a, r, o;
            return i = t.find("option:selected").text(), a = {
                Austria: "ATU000000000",
                Belgium: "BE0000000000",
                Bulgaria: "BG000000000...",
                Croatia: "",
                Cyprus: "CY000000000X",
                "Czech Republic": "CZ00000000...",
                Denmark: "DK00 00 00 00",
                Estonia: "EE000000000",
                Finland: "FI00000000",
                France: "FRXX 000000000",
                Germany: "DE000000000",
                Greece: "EL000000000",
                Hungary: "HU00000000",
                Iceland: "",
                Ireland: "IE...",
                Italy: "IT00000000000",
                Latvia: "LV00000000000",
                Lithuania: "LT000000000...",
                Luxembourg: "LU00000000",
                Malta: "MT00000000",
                Netherlands: "NL000000000B00",
                Norway: "",
                Poland: "PL0000000000",
                Portugal: "PT000000000",
                Romania: "RO...",
                Slovakia: "SK0000000000",
                Slovenia: "",
                Spain: "ES...",
                Sweden: "SE000000000000",
                Switzerland: "",
                "United Kingdom": "GB..."
            }, s = ["Angola", "Antigua and Barbuda", "Aruba", "Bahamas", "Belize", "Benin", "Botswana", "Cameroon", "Comoros", "Congo (Brazzaville)", "Congo (Kinshasa)", "Cook Islands", "C\xf4te d'Ivoire", "Djibouti", "Dominica", "Fiji", "French Southern Lands", "Ghana", "Guyana", "Hong Kong", "Ireland", "Kiribati", "Korea, North", "Malawi", "Maritania", "Mauritius", "Montserrat", "Nauru", "Niue", "Qatar", "Saint Kitts and Nevis", "Saint Lucia", "Sao Tome and Principe", "Seychelles", "Sierra Leone", "Sint Maarten (Dutch part)", "Solomon Islands", "Somalia", "Suriname", "Syria", "Togo", "Tokelau", "Tonga", "United Arab Emirates", "Vanuatu", "Yemen", "Zimbabwe"], r = a[i], $(".js-setup-creditcard").toggleClass("is-vat-country", null != r), o = null != r ? "(" + r + ")" : "", n = t.parents(".js-setup-creditcard").find(".js-vat-help-text"), n.html(o), "United States of America" !== i ? ($(".js-setup-creditcard").addClass("is-international"), $(".js-select-state").removeAttr("required").val("")) : ($(".js-setup-creditcard").removeClass("is-international"), $(".js-select-state").attr("required", "required")), e.call(s, i) >= 0 ? ($(".js-postal-code-form").hide(), $(".js-postal-code-field").removeAttr("required").val("")) : ($(".js-postal-code-form").show(), $(".js-postal-code-field").attr("required", "required"))
        }, $(document).on("change", ".js-select-country", function() {
            return t($(this))
        }), $.observe(".js-select-country", function() {
            t($(this))
        })
    }.call(this),
    function() {
        $(document).on("click", ".js-toggle-currency", function() {
            return $(".js-currency").toggleClass("is-hidden"), !1
        })
    }.call(this),
    function() {
        $(document).on("change", ".js-payment-methods .js-payment-method", function() {
            var t, e;
            return t = $(this).closest(".js-payment-methods"), e = $(this).attr("data-selected-tab"), t.find(".js-selected-payment-method").removeClass("active"), t.find("." + e).addClass("active")
        }), $.observe(".js-selected-payment-method:not(.active)", {
            add: function() {
                return $(this).addClass("has-removed-contents")
            },
            remove: function() {
                return $(this).removeClass("has-removed-contents")
            }
        }), $.observe(".js-billing-payment-methods", function() {
            return $(this).removeClass("disabled")
        })
    }.call(this),
    function() {
        var t, e, n = [].indexOf || function(t) {
            for (var e = 0, n = this.length; n > e; e++)
                if (e in this && this[e] === t) return e;
            return -1
        };
        t = ["paypal-loading", "paypal-logged-in", "paypal-logged-out", "paypal-down"], e = function(e) {
            var i, s, a, r, o;
            i = $(e), s = i.closest(".js-payment-methods"), i.find("#braintree-paypal-button").length > 0 || (o = function(e) {
                return s.removeClass(t.join(" ")), n.call(t, e) >= 0 ? s.addClass(e) : void 0
            }, s.data("token") || o("paypal-loading"), r = function() {
                return o("paypal-down")
            }, a = function() {
                return Promise.resolve(s.data("token") || $.ajax("/account/billing/client_token"))
            }, a().then(function(t) {
                var e;
                return s.data("token") || s.data("token", t), e = new Promise(function(e) {
                    var n;
                    return n = i.find(i.attr("data-nonce-field")), braintree.setup(t, "paypal", {
                        displayName: "GitHub",
                        container: i,
                        paymentMethodNonceInputField: n,
                        onSuccess: function() {
                            return o("paypal-logged-in"), e()
                        }
                    })
                }), o("paypal-logged-out"), e.then(function() {
                    return i.find("#bt-pp-cancel").on("click", function() {
                        return o("paypal-logged-out")
                    })
                }, r)
            }, r))
        }, $.observe(".js-paypal-container", e)
    }.call(this),
    function() {
        var t, e;
        e = null, t = function() {
            var t, n, i;
            return e && e.abort(), t = Math.max(0, parseInt(this.value) || 0), n = t > 300, $(".js-purchase-button").prop("disabled", 0 === t || n), e = $.ajax({
                url: $(this).attr("data-url"),
                data: {
                    seats: t
                }
            }), i = function(t) {
                var e, i, s;
                $(".js-contact-us").toggleClass("hidden", !n), $(".js-payment-summary").toggleClass("hidden", n), s = t.selectors;
                for (e in s) i = s[e], $(e).text(i);
                return window.history.replaceState($.pjax.state, null, t.url)
            }, e.then(i)
        }, $.observe(".js-seats-field", function() {
            return $(this).on("throttled:input", t), t.call($(".js-seats-field")[0])
        })
    }.call(this),
    function() {
        var t, e, n, i, s, a;
        t = 500, a = null, s = null, i = [], e = new Promise(function(t) {
            return $(window).on("load", function() {
                return t()
            })
        }), GitHub.stats = function(a) {
            return i.push(a), e.then(function() {
                return null != s ? s : s = setTimeout(n, t)
            })
        }, n = function() {
            return null == a && (a = $("meta[name=browser-stats-url]").prop("content")), a ? (s = null, $.ajax({
                url: a,
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(i)
            }), i = []) : void 0
        }
    }.call(this),
    function() {
        GitHub.stats({
            browserfeatures: {
                classlist: GitHub.support.classList,
                classlist_multi_arg: GitHub.support.classListMultiArg,
                custom_elements: GitHub.support.registerElement,
                emoji: GitHub.support.emoji,
                promise: GitHub.support.Promise,
                request_animation_frame: GitHub.support.requestAnimationFrame,
                setimmediate: GitHub.support.setImmediate,
                url: GitHub.support.URL,
                weakmap: GitHub.support.WeakMap,
                placeholder_input: GitHub.support.placeholder_input,
                placeholder_textarea: GitHub.support.placeholder_textarea,
                performance_now: GitHub.support.performanceNow,
                performance_mark: GitHub.support.performanceMark,
                performance_getentries: GitHub.support.performanceGetEntries
            }
        })
    }.call(this),
    function() {
        var t, e;
        e = function() {
            var e, n, i, s, a, r;
            return s = new TryStorage(localStorage), i = function() {
                try {
                    return JSON.parse(s.getItem("bundle-urls"))
                } catch (t) {}
            }(), null == i && (i = {}), r = t(), s.setItem("bundle-urls", JSON.stringify(r)), n = function() {
                var t;
                t = [];
                for (e in r) a = r[e], i[e] !== a && t.push(e);
                return t
            }(), n.length ? GitHub.stats({
                downloadedbundles: n
            }) : void 0
        }, t = function() {
            var t, e, n, i, s, a, r, o, c, l, u;
            for (s = {}, l = $("script"), a = 0, o = l.length; o > a; a++) i = l[a], n = i.src.match(/\/([\w-]+)-[0-9a-f]{40}\.js$/), null != n && (t = n[1], s["" + t + ".js"] = i.src);
            for (u = $("link[rel=stylesheet]"), r = 0, c = u.length; c > r; r++) e = u[r], n = e.href.match(/\/([\w-]+)-[0-9a-f]{40}\.css$/), null != n && (t = n[1], s["" + t + ".css"] = e.href);
            return s
        }, $(window).on("load", e)
    }.call(this),
    function() {
        $(document).on("click:prepare", ".minibutton.disabled, .button.disabled", function(t) {
            t.preventDefault(), t.stopPropagation()
        })
    }.call(this),
    function() {
        var t, e, n;
        t = function(t) {
            return $(t).closest(".js-check-all-container")[0] || document.body
        }, e = function(t, e, n) {
            e.checked !== n && (e.checked = n, $(e).fire("change", {
                relatedTarget: t,
                async: !0
            }))
        }, $(document).on("change", "input.js-check-all", function(n) {
            var i, s, a, r, o;
            if (!$(n.relatedTarget).is("input.js-check-all-item")) {
                for (i = $(t(this)), s = i.find("input.js-check-all-item"), r = 0, o = s.length; o > r; r++) a = s[r], e(this, a, this.checked);
                s.removeClass("is-last-changed")
            }
        }), n = null, $(document).on("mousedown", "input.js-check-all-item", function(t) {
            n = t.shiftKey
        }), $(document).on("change", "input.js-check-all-item", function(i) {
            var s, a, r, o, c, l, u, d, h, f, m, p, g, v;
            if (!$(i.relatedTarget).is("input.js-check-all, input.js-check-all-item")) {
                if (s = $(t(this)), r = s.find("input.js-check-all")[0], a = s.find("input.js-check-all-item"), n && (d = a.filter(".is-last-changed")[0]))
                    for (o = a.toArray(), g = [o.indexOf(d), o.indexOf(this)].sort(), h = g[0], l = g[1], v = o.slice(h, +l + 1 || 9e9), m = 0, p = v.length; p > m; m++) u = v[m], e(this, u, this.checked);
                n = null, a.removeClass("is-last-changed"), $(this).addClass("is-last-changed"), f = a.length, c = function() {
                    var t, e, n;
                    for (n = [], t = 0, e = a.length; e > t; t++) u = a[t], u.checked && n.push(u);
                    return n
                }().length, e(this, r, c === f)
            }
        }), $(document).on("change", "input.js-check-all-item", function() {
            var e, n, i;
            e = $(t(this)), n = e.find(".js-check-all-count"), n.length && (i = e.find("input.js-check-all-item:checked").length, n.text(i))
        })
    }.call(this),
    function() {
        var t;
        null == window.GitHub && (window.GitHub = {}), window.GitHub.assetHostUrl = null != (t = $("link[rel=assets]").prop("href")) ? t : "/"
    }.call(this),
    function() {
        var t, e;
        ZeroClipboard.config({
            swfPath: "" + GitHub.assetHostUrl + "flash/ZeroClipboard.v" + ZeroClipboard.version + ".swf",
            trustedOrigins: [location.hostname],
            flashLoadTimeout: 1e4,
            cacheBust: null != (e = /MSIE/.test(navigator.userAgent) || /Trident\/[\d](?=[^\?]+).*rv:([0-9.].)/.test(navigator.userAgent)) ? e : {
                "true": !1
            }
        }), $.observe("button.js-zeroclipboard", t = function(t) {
            var e, n, i;
            i = new ZeroClipboard(t), i.on("aftercopy", function() {
                var t;
                return t = $(this).attr("data-copied-hint"), $("#global-zeroclipboard-html-bridge").attr("aria-label", t || "Copied!")
            }), i.on("error", function() {
                return $("#global-zeroclipboard-html-bridge, .js-zeroclipboard").remove()
            }), n = function() {
                var t;
                return t = $(this).attr("aria-label"), $("#global-zeroclipboard-html-bridge").addClass("tooltipped tooltipped-s").attr("aria-label", t || "Copy to clipboard.")
            }, e = function() {
                return $("#global-zeroclipboard-html-bridge").removeClass("tooltipped tooltipped-s")
            }, $(t).hover(n, e)
        })
    }.call(this),
    function() {
        $(document).on("ajaxBeforeSend", ".js-new-comment-form", function(t) {
            return this === t.target && $(this).data("remote-xhr") ? !1 : void 0
        }), $(document).on("ajaxSend", ".js-new-comment-form", function(t) {
            return this === t.target ? $(this).find(".js-comment-form-error").hide() : void 0
        }), $(document).on("ajaxSuccess", ".js-new-comment-form", function(t, e, n, i) {
            var s, a, r, o;
            if (this === t.target) {
                this.reset(), $(this).find(".js-comment-field").trigger("validation:field:change"), $(this).find(".js-write-tab").click(), o = i.updateContent;
                for (r in o) a = o[r], s = $(r), s[0] || console.warn("couldn't find " + r + " for immediate update"), s.updateContent(a)
            }
        }), $(document).on("ajaxError", ".js-new-comment-form", function(t, e) {
            var n, i;
            if (this === t.target) return i = "Sorry! We couldn't save your comment", 422 === e.status && (n = JSON.parse(e.responseText), n.errors && (i += " \u2014 your comment ", i += " " + n.errors.join(", "))), i += ". ", i += "Please try again.", $(this).find(".js-comment-form-error").show().text(i), !1
        })
    }.call(this),
    function() {
        var t, e, n;
        t = new WeakMap, e = function(e) {
            var n, i, s, a;
            for (a = [], i = 0, s = e.length; s > i; i++) n = e[i], a.push(t.get(n) ? void 0 : t.set(n, $(n).text()));
            return a
        }, n = function(e, n) {
            return e.text(function() {
                return n.value.trim() ? this.getAttribute("data-comment-text") : t.get(this)
            })
        }, $(document).onFocusedInput(".js-comment-field", function() {
            var t;
            return t = $(this).closest("form").find(".js-comment-and-button"), t.length ? (e(t), function() {
                n(t, this)
            }) : void 0
        })
    }.call(this),
    function() {
        $(document).on("click", ".js-comment-edit-button", function() {
            var t;
            return t = $(this).closest(".js-comment"), t.addClass("is-comment-editing"), t.find(".js-comment-field").focus().trigger("change"), !1
        }), $(document).on("click", ".js-comment-cancel-button", function() {
            var t;
            return t = $(this).closest("form"), t.hasDirtyFields() && !confirm($(this).attr("data-confirm-text")) ? !1 : (t[0].reset(), $(this).closest(".js-comment").removeClass("is-comment-editing"), !1)
        }), $(document).on("ajaxSend", ".js-comment-delete, .js-comment-update, .js-issue-update", function(t, e) {
            var n, i;
            return i = $(this).closest(".js-comment"), i.addClass("is-comment-loading"), i.find(".minibutton").addClass("disabled"), (n = i.attr("data-body-version")) ? e.setRequestHeader("X-Body-Version", n) : void 0
        }), $(document).on("ajaxError", ".js-comment-update", function(t, e, n, i) {
            var s, a, r, o;
            if (console.error("ajaxError for js-comment-update", i), 422 === e.status) try {
                if (a = JSON.parse(e.responseText), s = $(this).closest(".js-comment"), a.stale) return e.stale = !0, s.addClass("is-comment-stale"), s.find(".minibutton").addClass("disabled"), s.hasClass("is-updating-task-list") && window.location.reload(), t.preventDefault();
                if (a.errors) return r = "There was an error posting your comment: " + a.errors.join(", "), s.find(".js-comment-update-error").text(r).show(), t.preventDefault()
            } catch (o) {
                return o = o, console.error("Error trying to handle ajaxError for js-comment-update: " + o)
            }
        }), $(document).on("ajaxComplete", ".js-comment-delete, .js-comment-update", function(t, e) {
            var n;
            return n = $(this).closest(".js-comment"), n.removeClass("is-comment-loading"), n.find(".minibutton").removeClass("disabled"), e.stale ? n.find(".form-actions button[type=submit].minibutton").addClass("disabled") : void 0
        }), $(document).on("ajaxSuccess", ".js-comment-delete", function() {
            var t, e;
            return t = $(this).closest(".js-comment"), e = $(this).closest(".js-comment-container"), e.length || (e = t), e.fadeOut(function() {
                return t.remove()
            })
        }), $(document).on("ajaxSuccess", ".js-comment-update", function(t, e, n, i) {
            var s, a, r, o, c, l;
            for (s = $(this).closest(".js-comment"), a = $(this).closest(".js-comment-container"), a.length || (a = s), s.find(".js-comment-body").html(i.body), s.find(".js-comment-update-error").hide(), s.attr("data-body-version", i.newBodyVersion), l = s.find("input, textarea"), o = 0, c = l.length; c > o; o++) r = l[o], r.defaultValue = r.value;
            return s.removeClass("is-comment-editing")
        }), $(document).on("ajaxSuccess", ".js-issue-update", function(t, e, n, i) {
            var s, a, r, o, c;
            for (s = $(this).parents(".js-details-container"), s.find(".js-details-target").last().click(), null != i.issue_title && (s.find(".js-issue-title").text(i.issue_title), s.closest(".js-issues-results").find(".js-merge-pull-request textarea").val(i.issue_title)), document.title = i.page_title, c = s.find("input"), r = 0, o = c.length; o > r; r++) a = c[r], a.defaultValue = a.value
        })
    }.call(this),
    function() {
        $(document).on("focusin", ".js-write-bucket", function() {
            return $(this).addClass("focused")
        }), $(document).on("focusout", ".js-write-bucket", function() {
            return $(this).removeClass("focused")
        })
    }.call(this),
    function() {
        $(document).onFocusedKeydown(".js-comment-field", function() {
            return function(t) {
                var e;
                return "ctrl+L" !== t.hotkey && "meta+L" !== t.hotkey || !(e = $(this).parents(".js-previewable-comment-form").find(".js-enable-fullscreen")) ? void 0 : (e.click(), !1)
            }
        })
    }.call(this),
    function() {
        var t, e;
        $(document).on("click", ".js-write-tab", function() {
            var t;
            return t = $(this).closest(".js-previewable-comment-form"), t.addClass("write-selected").removeClass("preview-selected"), t.find(".tabnav-tab").removeClass("selected"), $(this).addClass("selected"), !1
        }), $(document).on("click", ".js-preview-tab", function() {
            var n;
            return n = $(this).closest(".js-previewable-comment-form"), n.addClass("preview-selected").removeClass("write-selected"), n.find(".tabnav-tab").removeClass("selected"), $(this).addClass("selected"), t(n), e(n), !1
        }), e = function(t) {
            var e;
            return e = t.find(".comment-body"), e.html("<p>Loading preview&hellip;</p>"), $.ajax({
                context: t[0],
                type: "POST",
                url: t.attr("data-preview-url"),
                data: {
                    text: t.find(".js-comment-field").val()
                },
                success: function(t) {
                    return e.html(t || "<p>Nothing to preview</p>")
                }
            })
        }, $(document).onFocusedKeydown(".js-comment-field", function() {
            return function(t) {
                var e;
                return "ctrl+P" !== t.hotkey && "meta+P" !== t.hotkey || (e = $(this).closest(".js-previewable-comment-form"), !e.hasClass("write-selected")) ? void 0 : ($(this).blur(), e.find(".preview-tab").click(), t.stopImmediatePropagation(), !1)
            }
        }), t = function(t) {
            return $(document).off("keydown.unpreview"), $(document).on("keydown.unpreview", function(e) {
                return "ctrl+P" === e.hotkey || "meta+P" === e.hotkey ? (t.find(".js-write-tab").click(), t.find(".js-comment-field").focus(), $(document).off("keydown.unpreview"), !1) : void 0
            })
        }
    }.call(this),
    function() {
        $(document).on("click", ".js-expand-comments-prompt", function() {
            return $(this).closest(".js-nested-comments").toggleClass("open")
        })
    }.call(this),
    function() {
        $(document).on("pjax:send", ".context-loader-container", function() {
            var t;
            return t = $(this).find(".context-loader").first(), t.length ? t.addClass("is-context-loading") : $(".page-context-loader").addClass("is-context-loading")
        }), $(document).on("pjax:complete", ".context-loader-container", function(t) {
            return $(t.target).find(".context-loader").first().removeClass("is-context-loading"), $(".page-context-loader").removeClass("is-context-loading"), $(document.body).removeClass("disables-context-loader")
        }), $(document).on("pjax:timeout", ".context-loader-container", function() {
            return !1
        })
    }.call(this),
    function() {
        $.hashChange(function(t) {
            var e;
            return e = window.location.hash.slice(1), e && /\/(issues|pulls?)\/\d+/.test(t.newURL) ? GitHub.stats({
                conversation_anchor: {
                    anchor: e,
                    matches_element: t.target !== window
                }
            }) : void 0
        })
    }.call(this),
    /**
     * jquery.Jcrop.js v0.9.12
     * jQuery Image Cropping Plugin - released under MIT License
     * Author: Kelly Hallman <khallman@gmail.com>
     * http://github.com/tapmodo/Jcrop
     * Copyright (c) 2008-2013 Tapmodo Interactive LLC {{{
     *
     * Permission is hereby granted, free of charge, to any person
     * obtaining a copy of this software and associated documentation
     * files (the "Software"), to deal in the Software without
     * restriction, including without limitation the rights to use,
     * copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the
     * Software is furnished to do so, subject to the following
     * conditions:
     *
     * The above copyright notice and this permission notice shall be
     * included in all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
     * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
     * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
     * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
     * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
     * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
     * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
     * OTHER DEALINGS IN THE SOFTWARE.
     *
     * }}}
     */
    function(t) {
        t.Jcrop = function(e, n) {
            function i(t) {
                return Math.round(t) + "px"
            }

            function s(t) {
                return E.baseClass + "-" + t
            }

            function a() {
                return t.fx.step.hasOwnProperty("backgroundColor")
            }

            function r(e) {
                var n = t(e).offset();
                return [n.left, n.top]
            }

            function o(t) {
                return [t.pageX - M[0], t.pageY - M[1]]
            }

            function c(e) {
                "object" != typeof e && (e = {}), E = t.extend(E, e), t.each(["onChange", "onSelect", "onRelease", "onDblClick"], function(t, e) {
                    "function" != typeof E[e] && (E[e] = function() {})
                })
            }

            function l(t, e, n) {
                if (M = r(q), me.setCursor("move" === t ? t : t + "-resize"), "move" === t) return me.activateHandlers(d(e), g, n);
                var i = de.getFixed(),
                    s = h(t),
                    a = de.getCorner(h(s));
                de.setPressed(de.getCorner(s)), de.setCurrent(a), me.activateHandlers(u(t, i), g, n)
            }

            function u(t, e) {
                return function(n) {
                    if (E.aspectRatio) switch (t) {
                        case "e":
                            n[1] = e.y + 1;
                            break;
                        case "w":
                            n[1] = e.y + 1;
                            break;
                        case "n":
                            n[0] = e.x + 1;
                            break;
                        case "s":
                            n[0] = e.x + 1
                    } else switch (t) {
                        case "e":
                            n[1] = e.y2;
                            break;
                        case "w":
                            n[1] = e.y2;
                            break;
                        case "n":
                            n[0] = e.x2;
                            break;
                        case "s":
                            n[0] = e.x2
                    }
                    de.setCurrent(n), fe.update()
                }
            }

            function d(t) {
                var e = t;
                return pe.watchKeys(),
                    function(t) {
                        de.moveOffset([t[0] - e[0], t[1] - e[1]]), e = t, fe.update()
                    }
            }

            function h(t) {
                switch (t) {
                    case "n":
                        return "sw";
                    case "s":
                        return "nw";
                    case "e":
                        return "nw";
                    case "w":
                        return "ne";
                    case "ne":
                        return "sw";
                    case "nw":
                        return "se";
                    case "se":
                        return "nw";
                    case "sw":
                        return "ne"
                }
            }

            function f(t) {
                return function(e) {
                    return E.disabled ? !1 : "move" !== t || E.allowMove ? (M = r(q), ie = !0, l(t, o(e)), e.stopPropagation(), e.preventDefault(), !1) : !1
                }
            }

            function m(t, e, n) {
                var i = t.width(),
                    s = t.height();
                i > e && e > 0 && (i = e, s = e / t.width() * t.height()), s > n && n > 0 && (s = n, i = n / t.height() * t.width()), ee = t.width() / i, ne = t.height() / s, t.width(i).height(s)
            }

            function p(t) {
                return {
                    x: t.x * ee,
                    y: t.y * ne,
                    x2: t.x2 * ee,
                    y2: t.y2 * ne,
                    w: t.w * ee,
                    h: t.h * ne
                }
            }

            function g() {
                var t = de.getFixed();
                t.w > E.minSelect[0] && t.h > E.minSelect[1] ? (fe.enableHandles(), fe.done()) : fe.release(), me.setCursor(E.allowSelect ? "crosshair" : "default")
            }

            function v(t) {
                if (E.disabled) return !1;
                if (!E.allowSelect) return !1;
                ie = !0, M = r(q), fe.disableHandles(), me.setCursor("crosshair");
                var e = o(t);
                return de.setPressed(e), fe.update(), me.activateHandlers($, g, "touch" === t.type.substring(0, 5)), pe.watchKeys(), t.stopPropagation(), t.preventDefault(), !1
            }

            function $(t) {
                de.setCurrent(t), fe.update()
            }

            function j() {
                var e = t("<div></div>").addClass(s("tracker"));
                return O && e.css({
                    opacity: 0,
                    backgroundColor: "white"
                }), e
            }

            function b(t) {
                Y.removeClass().addClass(s("holder")).addClass(t)
            }

            function y(t, e) {
                function n() {
                    window.setTimeout($, d)
                }
                var i = t[0] / ee,
                    s = t[1] / ne,
                    a = t[2] / ee,
                    r = t[3] / ne;
                if (!se) {
                    var o = de.flipCoords(i, s, a, r),
                        c = de.getFixed(),
                        l = [c.x, c.y, c.x2, c.y2],
                        u = l,
                        d = E.animationDelay,
                        h = o[0] - l[0],
                        f = o[1] - l[1],
                        m = o[2] - l[2],
                        p = o[3] - l[3],
                        g = 0,
                        v = E.swingSpeed;
                    i = u[0], s = u[1], a = u[2], r = u[3], fe.animMode(!0);
                    var $ = function() {
                        return function() {
                            g += (100 - g) / v, u[0] = Math.round(i + g / 100 * h), u[1] = Math.round(s + g / 100 * f), u[2] = Math.round(a + g / 100 * m), u[3] = Math.round(r + g / 100 * p), g >= 99.8 && (g = 100), 100 > g ? (x(u), n()) : (fe.done(), fe.animMode(!1), "function" == typeof e && e.call(ge))
                        }
                    }();
                    n()
                }
            }

            function w(t) {
                x([t[0] / ee, t[1] / ne, t[2] / ee, t[3] / ne]), E.onSelect.call(ge, p(de.getFixed())), fe.enableHandles()
            }

            function x(t) {
                de.setPressed([t[0], t[1]]), de.setCurrent([t[2], t[3]]), fe.update()
            }

            function k() {
                return p(de.getFixed())
            }

            function C() {
                return de.getFixed()
            }

            function S(t) {
                c(t), _()
            }

            function T() {
                E.disabled = !0, fe.disableHandles(), fe.setCursor("default"), me.setCursor("default")
            }

            function L() {
                E.disabled = !1, _()
            }

            function D() {
                fe.done(), me.activateHandlers(null, null)
            }

            function A() {
                Y.remove(), F.show(), F.css("visibility", "visible"), t(e).removeData("Jcrop")
            }

            function H(t, e) {
                fe.release(), T();
                var n = new Image;
                n.onload = function() {
                    var i = n.width,
                        s = n.height,
                        a = E.boxWidth,
                        r = E.boxHeight;
                    q.width(i).height(s), q.attr("src", t), G.attr("src", t), m(q, a, r), U = q.width(), W = q.height(), G.width(U).height(W), oe.width(U + 2 * re).height(W + 2 * re), Y.width(U).height(W), he.resize(U, W), L(), "function" == typeof e && e.call(ge)
                }, n.src = t
            }

            function P(t, e, n) {
                var i = e || E.bgColor;
                E.bgFade && a() && E.fadeTime && !n ? t.animate({
                    backgroundColor: i
                }, {
                    queue: !1,
                    duration: E.fadeTime
                }) : t.css("backgroundColor", i)
            }

            function _(t) {
                E.allowResize ? t ? fe.enableOnly() : fe.enableHandles() : fe.disableHandles(), me.setCursor(E.allowSelect ? "crosshair" : "default"), fe.setCursor(E.allowMove ? "move" : "default"), E.hasOwnProperty("trueSize") && (ee = E.trueSize[0] / U, ne = E.trueSize[1] / W), E.hasOwnProperty("setSelect") && (w(E.setSelect), fe.done(), delete E.setSelect), he.refresh(), E.bgColor != ce && (P(E.shade ? he.getShades() : Y, E.shade ? E.shadeColor || E.bgColor : E.bgColor), ce = E.bgColor), le != E.bgOpacity && (le = E.bgOpacity, E.shade ? he.refresh() : fe.setBgOpacity(le)), V = E.maxSize[0] || 0, Q = E.maxSize[1] || 0, Z = E.minSize[0] || 0, te = E.minSize[1] || 0, E.hasOwnProperty("outerImage") && (q.attr("src", E.outerImage), delete E.outerImage), fe.refresh()
            }
            var M, E = t.extend({}, t.Jcrop.defaults),
                I = navigator.userAgent.toLowerCase(),
                O = /msie/.test(I),
                B = /msie [1-6]\./.test(I);
            "object" != typeof e && (e = t(e)[0]), "object" != typeof n && (n = {}), c(n);
            var R = {
                    border: "none",
                    visibility: "visible",
                    margin: 0,
                    padding: 0,
                    position: "absolute",
                    top: 0,
                    left: 0
                },
                F = t(e),
                N = !0;
            if ("IMG" == e.tagName) {
                if (0 != F[0].width && 0 != F[0].height) F.width(F[0].width), F.height(F[0].height);
                else {
                    var z = new Image;
                    z.src = F[0].src, F.width(z.width), F.height(z.height)
                }
                var q = F.clone().removeAttr("id").css(R).show();
                q.width(F.width()), q.height(F.height()), F.after(q).hide()
            } else q = F.css(R).show(), N = !1, null === E.shade && (E.shade = !0);
            m(q, E.boxWidth, E.boxHeight);
            var U = q.width(),
                W = q.height(),
                Y = t("<div />").width(U).height(W).addClass(s("holder")).css({
                    position: "relative",
                    backgroundColor: E.bgColor
                }).insertAfter(F).append(q);
            E.addClass && Y.addClass(E.addClass);
            var G = t("<div />"),
                K = t("<div />").width("100%").height("100%").css({
                    zIndex: 310,
                    position: "absolute",
                    overflow: "hidden"
                }),
                J = t("<div />").width("100%").height("100%").css("zIndex", 320),
                X = t("<div />").css({
                    position: "absolute",
                    zIndex: 600
                }).dblclick(function() {
                    var t = de.getFixed();
                    E.onDblClick.call(ge, t)
                }).insertBefore(q).append(K, J);
            N && (G = t("<img />").attr("src", q.attr("src")).css(R).width(U).height(W), K.append(G)), B && X.css({
                overflowY: "hidden"
            });
            var V, Q, Z, te, ee, ne, ie, se, ae, re = E.boundary,
                oe = j().width(U + 2 * re).height(W + 2 * re).css({
                    position: "absolute",
                    top: i(-re),
                    left: i(-re),
                    zIndex: 290
                }).mousedown(v),
                ce = E.bgColor,
                le = E.bgOpacity;
            M = r(q);
            var ue = function() {
                    function t() {
                        var t, e = {},
                            n = ["touchstart", "touchmove", "touchend"],
                            i = document.createElement("div");
                        try {
                            for (t = 0; t < n.length; t++) {
                                var s = n[t];
                                s = "on" + s;
                                var a = s in i;
                                a || (i.setAttribute(s, "return;"), a = "function" == typeof i[s]), e[n[t]] = a
                            }
                            return e.touchstart && e.touchend && e.touchmove
                        } catch (r) {
                            return !1
                        }
                    }

                    function e() {
                        return E.touchSupport === !0 || E.touchSupport === !1 ? E.touchSupport : t()
                    }
                    return {
                        createDragger: function(t) {
                            return function(e) {
                                return E.disabled ? !1 : "move" !== t || E.allowMove ? (M = r(q), ie = !0, l(t, o(ue.cfilter(e)), !0), e.stopPropagation(), e.preventDefault(), !1) : !1
                            }
                        },
                        newSelection: function(t) {
                            return v(ue.cfilter(t))
                        },
                        cfilter: function(t) {
                            return t.pageX = t.originalEvent.changedTouches[0].pageX, t.pageY = t.originalEvent.changedTouches[0].pageY, t
                        },
                        isSupported: t,
                        support: e()
                    }
                }(),
                de = function() {
                    function t(t) {
                        t = r(t), m = h = t[0], p = f = t[1]
                    }

                    function e(t) {
                        t = r(t), u = t[0] - m, d = t[1] - p, m = t[0], p = t[1]
                    }

                    function n() {
                        return [u, d]
                    }

                    function i(t) {
                        var e = t[0],
                            n = t[1];
                        0 > h + e && (e -= e + h), 0 > f + n && (n -= n + f), p + n > W && (n += W - (p + n)), m + e > U && (e += U - (m + e)), h += e, m += e, f += n, p += n
                    }

                    function s(t) {
                        var e = a();
                        switch (t) {
                            case "ne":
                                return [e.x2, e.y];
                            case "nw":
                                return [e.x, e.y];
                            case "se":
                                return [e.x2, e.y2];
                            case "sw":
                                return [e.x, e.y2]
                        }
                    }

                    function a() {
                        if (!E.aspectRatio) return c();
                        var t, e, n, i, s = E.aspectRatio,
                            a = E.minSize[0] / ee,
                            r = E.maxSize[0] / ee,
                            u = E.maxSize[1] / ne,
                            d = m - h,
                            g = p - f,
                            v = Math.abs(d),
                            $ = Math.abs(g),
                            j = v / $;
                        return 0 === r && (r = 10 * U), 0 === u && (u = 10 * W), s > j ? (e = p, n = $ * s, t = 0 > d ? h - n : n + h, 0 > t ? (t = 0, i = Math.abs((t - h) / s), e = 0 > g ? f - i : i + f) : t > U && (t = U, i = Math.abs((t - h) / s), e = 0 > g ? f - i : i + f)) : (t = m, i = v / s, e = 0 > g ? f - i : f + i, 0 > e ? (e = 0, n = Math.abs((e - f) * s), t = 0 > d ? h - n : n + h) : e > W && (e = W, n = Math.abs(e - f) * s, t = 0 > d ? h - n : n + h)), t > h ? (a > t - h ? t = h + a : t - h > r && (t = h + r), e = e > f ? f + (t - h) / s : f - (t - h) / s) : h > t && (a > h - t ? t = h - a : h - t > r && (t = h - r), e = e > f ? f + (h - t) / s : f - (h - t) / s), 0 > t ? (h -= t, t = 0) : t > U && (h -= t - U, t = U), 0 > e ? (f -= e, e = 0) : e > W && (f -= e - W, e = W), l(o(h, f, t, e))
                    }

                    function r(t) {
                        return t[0] < 0 && (t[0] = 0), t[1] < 0 && (t[1] = 0), t[0] > U && (t[0] = U), t[1] > W && (t[1] = W), [Math.round(t[0]), Math.round(t[1])]
                    }

                    function o(t, e, n, i) {
                        var s = t,
                            a = n,
                            r = e,
                            o = i;
                        return t > n && (s = n, a = t), e > i && (r = i, o = e), [s, r, a, o]
                    }

                    function c() {
                        var t, e = m - h,
                            n = p - f;
                        return V && Math.abs(e) > V && (m = e > 0 ? h + V : h - V), Q && Math.abs(n) > Q && (p = n > 0 ? f + Q : f - Q), te / ne && Math.abs(n) < te / ne && (p = n > 0 ? f + te / ne : f - te / ne), Z / ee && Math.abs(e) < Z / ee && (m = e > 0 ? h + Z / ee : h - Z / ee), 0 > h && (m -= h, h -= h), 0 > f && (p -= f, f -= f), 0 > m && (h -= m, m -= m), 0 > p && (f -= p, p -= p), m > U && (t = m - U, h -= t, m -= t), p > W && (t = p - W, f -= t, p -= t), h > U && (t = h - W, p -= t, f -= t), f > W && (t = f - W, p -= t, f -= t), l(o(h, f, m, p))
                    }

                    function l(t) {
                        return {
                            x: t[0],
                            y: t[1],
                            x2: t[2],
                            y2: t[3],
                            w: t[2] - t[0],
                            h: t[3] - t[1]
                        }
                    }
                    var u, d, h = 0,
                        f = 0,
                        m = 0,
                        p = 0;
                    return {
                        flipCoords: o,
                        setPressed: t,
                        setCurrent: e,
                        getOffset: n,
                        moveOffset: i,
                        getCorner: s,
                        getFixed: a
                    }
                }(),
                he = function() {
                    function e(t, e) {
                        m.left.css({
                            height: i(e)
                        }), m.right.css({
                            height: i(e)
                        })
                    }

                    function n() {
                        return s(de.getFixed())
                    }

                    function s(t) {
                        m.top.css({
                            left: i(t.x),
                            width: i(t.w),
                            height: i(t.y)
                        }), m.bottom.css({
                            top: i(t.y2),
                            left: i(t.x),
                            width: i(t.w),
                            height: i(W - t.y2)
                        }), m.right.css({
                            left: i(t.x2),
                            width: i(U - t.x2)
                        }), m.left.css({
                            width: i(t.x)
                        })
                    }

                    function a() {
                        return t("<div />").css({
                            position: "absolute",
                            backgroundColor: E.shadeColor || E.bgColor
                        }).appendTo(f)
                    }

                    function r() {
                        h || (h = !0, f.insertBefore(q), n(), fe.setBgOpacity(1, 0, 1), G.hide(), o(E.shadeColor || E.bgColor, 1), fe.isAwake() ? l(E.bgOpacity, 1) : l(1, 1))
                    }

                    function o(t, e) {
                        P(d(), t, e)
                    }

                    function c() {
                        h && (f.remove(), G.show(), h = !1, fe.isAwake() ? fe.setBgOpacity(E.bgOpacity, 1, 1) : (fe.setBgOpacity(1, 1, 1), fe.disableHandles()), P(Y, 0, 1))
                    }

                    function l(t, e) {
                        h && (E.bgFade && !e ? f.animate({
                            opacity: 1 - t
                        }, {
                            queue: !1,
                            duration: E.fadeTime
                        }) : f.css({
                            opacity: 1 - t
                        }))
                    }

                    function u() {
                        E.shade ? r() : c(), fe.isAwake() && l(E.bgOpacity)
                    }

                    function d() {
                        return f.children()
                    }
                    var h = !1,
                        f = t("<div />").css({
                            position: "absolute",
                            zIndex: 240,
                            opacity: 0
                        }),
                        m = {
                            top: a(),
                            left: a().height(W),
                            right: a().height(W),
                            bottom: a()
                        };
                    return {
                        update: n,
                        updateRaw: s,
                        getShades: d,
                        setBgColor: o,
                        enable: r,
                        disable: c,
                        resize: e,
                        refresh: u,
                        opacity: l
                    }
                }(),
                fe = function() {
                    function e(e) {
                        var n = t("<div />").css({
                            position: "absolute",
                            opacity: E.borderOpacity
                        }).addClass(s(e));
                        return K.append(n), n
                    }

                    function n(e, n) {
                        var i = t("<div />").mousedown(f(e)).css({
                            cursor: e + "-resize",
                            position: "absolute",
                            zIndex: n
                        }).addClass("ord-" + e);
                        return ue.support && i.bind("touchstart.jcrop", ue.createDragger(e)), J.append(i), i
                    }

                    function a(t) {
                        var e = E.handleSize,
                            i = n(t, T++).css({
                                opacity: E.handleOpacity
                            }).addClass(s("handle"));
                        return e && i.width(e).height(e), i
                    }

                    function r(t) {
                        return n(t, T++).addClass("jcrop-dragbar")
                    }

                    function o(t) {
                        var e;
                        for (e = 0; e < t.length; e++) A[t[e]] = r(t[e])
                    }

                    function c(t) {
                        var n, i;
                        for (i = 0; i < t.length; i++) {
                            switch (t[i]) {
                                case "n":
                                    n = "hline";
                                    break;
                                case "s":
                                    n = "hline bottom";
                                    break;
                                case "e":
                                    n = "vline right";
                                    break;
                                case "w":
                                    n = "vline"
                            }
                            L[t[i]] = e(n)
                        }
                    }

                    function l(t) {
                        var e;
                        for (e = 0; e < t.length; e++) D[t[e]] = a(t[e])
                    }

                    function u(t, e) {
                        E.shade || G.css({
                            top: i(-e),
                            left: i(-t)
                        }), X.css({
                            top: i(e),
                            left: i(t)
                        })
                    }

                    function d(t, e) {
                        X.width(Math.round(t)).height(Math.round(e))
                    }

                    function h() {
                        var t = de.getFixed();
                        de.setPressed([t.x, t.y]), de.setCurrent([t.x2, t.y2]), m()
                    }

                    function m(t) {
                        return S ? g(t) : void 0
                    }

                    function g(t) {
                        var e = de.getFixed();
                        d(e.w, e.h), u(e.x, e.y), E.shade && he.updateRaw(e), S || $(), t ? E.onSelect.call(ge, p(e)) : E.onChange.call(ge, p(e))
                    }

                    function v(t, e, n) {
                        (S || e) && (E.bgFade && !n ? q.animate({
                            opacity: t
                        }, {
                            queue: !1,
                            duration: E.fadeTime
                        }) : q.css("opacity", t))
                    }

                    function $() {
                        X.show(), E.shade ? he.opacity(le) : v(le, !0), S = !0
                    }

                    function b() {
                        x(), X.hide(), E.shade ? he.opacity(1) : v(1), S = !1, E.onRelease.call(ge)
                    }

                    function y() {
                        H && J.show()
                    }

                    function w() {
                        return H = !0, E.allowResize ? (J.show(), !0) : void 0
                    }

                    function x() {
                        H = !1, J.hide()
                    }

                    function k(t) {
                        t ? (se = !0, x()) : (se = !1, w())
                    }

                    function C() {
                        k(!1), h()
                    }
                    var S, T = 370,
                        L = {},
                        D = {},
                        A = {},
                        H = !1;
                    E.dragEdges && t.isArray(E.createDragbars) && o(E.createDragbars), t.isArray(E.createHandles) && l(E.createHandles), E.drawBorders && t.isArray(E.createBorders) && c(E.createBorders), t(document).bind("touchstart.jcrop-ios", function(e) {
                        t(e.currentTarget).hasClass("jcrop-tracker") && e.stopPropagation()
                    });
                    var P = j().mousedown(f("move")).css({
                        cursor: "move",
                        position: "absolute",
                        zIndex: 360
                    });
                    return ue.support && P.bind("touchstart.jcrop", ue.createDragger("move")), K.append(P), x(), {
                        updateVisible: m,
                        update: g,
                        release: b,
                        refresh: h,
                        isAwake: function() {
                            return S
                        },
                        setCursor: function(t) {
                            P.css("cursor", t)
                        },
                        enableHandles: w,
                        enableOnly: function() {
                            H = !0
                        },
                        showHandles: y,
                        disableHandles: x,
                        animMode: k,
                        setBgOpacity: v,
                        done: C
                    }
                }(),
                me = function() {
                    function e(e) {
                        oe.css({
                            zIndex: 450
                        }), e ? t(document).bind("touchmove.jcrop", r).bind("touchend.jcrop", c) : h && t(document).bind("mousemove.jcrop", i).bind("mouseup.jcrop", s)
                    }

                    function n() {
                        oe.css({
                            zIndex: 290
                        }), t(document).unbind(".jcrop")
                    }

                    function i(t) {
                        return u(o(t)), !1
                    }

                    function s(t) {
                        return t.preventDefault(), t.stopPropagation(), ie && (ie = !1, d(o(t)), fe.isAwake() && E.onSelect.call(ge, p(de.getFixed())), n(), u = function() {}, d = function() {}), !1
                    }

                    function a(t, n, i) {
                        return ie = !0, u = t, d = n, e(i), !1
                    }

                    function r(t) {
                        return u(o(ue.cfilter(t))), !1
                    }

                    function c(t) {
                        return s(ue.cfilter(t))
                    }

                    function l(t) {
                        oe.css("cursor", t)
                    }
                    var u = function() {},
                        d = function() {},
                        h = E.trackDocument;
                    return h || oe.mousemove(i).mouseup(s).mouseout(s), q.before(oe), {
                        activateHandlers: a,
                        setCursor: l
                    }
                }(),
                pe = function() {
                    function e() {
                        E.keySupport && (a.show(), a.focus())
                    }

                    function n() {
                        a.hide()
                    }

                    function i(t, e, n) {
                        E.allowMove && (de.moveOffset([e, n]), fe.updateVisible(!0)), t.preventDefault(), t.stopPropagation()
                    }

                    function s(t) {
                        if (t.ctrlKey || t.metaKey) return !0;
                        ae = t.shiftKey ? !0 : !1;
                        var e = ae ? 10 : 1;
                        switch (t.keyCode) {
                            case 37:
                                i(t, -e, 0);
                                break;
                            case 39:
                                i(t, e, 0);
                                break;
                            case 38:
                                i(t, 0, -e);
                                break;
                            case 40:
                                i(t, 0, e);
                                break;
                            case 27:
                                E.allowSelect && fe.release();
                                break;
                            case 9:
                                return !0
                        }
                        return !1
                    }
                    var a = t('<input type="radio" />').css({
                            position: "fixed",
                            left: "-120px",
                            width: "12px"
                        }).addClass("jcrop-keymgr"),
                        r = t("<div />").css({
                            position: "absolute",
                            overflow: "hidden"
                        }).append(a);
                    return E.keySupport && (a.keydown(s).blur(n), B || !E.fixedSupport ? (a.css({
                        position: "absolute",
                        left: "-20px"
                    }), r.append(a).insertBefore(q)) : a.insertBefore(q)), {
                        watchKeys: e
                    }
                }();
            ue.support && oe.bind("touchstart.jcrop", ue.newSelection), J.hide(), _(!0);
            var ge = {
                setImage: H,
                animateTo: y,
                setSelect: w,
                setOptions: S,
                tellSelect: k,
                tellScaled: C,
                setClass: b,
                disable: T,
                enable: L,
                cancel: D,
                release: fe.release,
                destroy: A,
                focus: pe.watchKeys,
                getBounds: function() {
                    return [U * ee, W * ne]
                },
                getWidgetSize: function() {
                    return [U, W]
                },
                getScaleFactor: function() {
                    return [ee, ne]
                },
                getOptions: function() {
                    return E
                },
                ui: {
                    holder: Y,
                    selection: X
                }
            };
            return O && Y.bind("selectstart", function() {
                return !1
            }), F.data("Jcrop", ge), ge
        }, t.fn.Jcrop = function(e, n) {
            var i;
            return this.each(function() {
                if (t(this).data("Jcrop")) {
                    if ("api" === e) return t(this).data("Jcrop");
                    t(this).data("Jcrop").setOptions(e)
                } else "IMG" == this.tagName ? t.Jcrop.Loader(this, function() {
                    t(this).css({
                        display: "block",
                        visibility: "hidden"
                    }), i = t.Jcrop(this, e), t.isFunction(n) && n.call(i)
                }) : (t(this).css({
                    display: "block",
                    visibility: "hidden"
                }), i = t.Jcrop(this, e), t.isFunction(n) && n.call(i))
            }), this
        }, t.Jcrop.Loader = function(e, n, i) {
            function s() {
                r.complete ? (a.unbind(".jcloader"), t.isFunction(n) && n.call(r)) : window.setTimeout(s, 50)
            }
            var a = t(e),
                r = a[0];
            a.bind("load.jcloader", s).bind("error.jcloader", function() {
                a.unbind(".jcloader"), t.isFunction(i) && i.call(r)
            }), r.complete && t.isFunction(n) && (a.unbind(".jcloader"), n.call(r))
        }, t.Jcrop.defaults = {
            allowSelect: !0,
            allowMove: !0,
            allowResize: !0,
            trackDocument: !0,
            baseClass: "jcrop",
            addClass: null,
            bgColor: "black",
            bgOpacity: .6,
            bgFade: !1,
            borderOpacity: .4,
            handleOpacity: .5,
            handleSize: null,
            aspectRatio: 0,
            keySupport: !0,
            createHandles: ["n", "s", "e", "w", "nw", "ne", "se", "sw"],
            createDragbars: ["n", "s", "e", "w"],
            createBorders: ["n", "s", "e", "w"],
            drawBorders: !0,
            dragEdges: !0,
            fixedSupport: !0,
            touchSupport: null,
            shade: null,
            boxWidth: 0,
            boxHeight: 0,
            boundary: 2,
            fadeTime: 400,
            animationDelay: 20,
            swingSpeed: 3,
            minSelect: [0, 0],
            maxSize: [0, 0],
            minSize: [0, 0],
            onChange: function() {},
            onSelect: function() {},
            onDblClick: function() {},
            onRelease: function() {}
        }
    }(jQuery),
    function() {
        var t, e = function(t, e) {
            return function() {
                return t.apply(e, arguments)
            }
        };
        t = function() {
            function t(t) {
                this.clearCropFormValues = e(this.clearCropFormValues, this), this.setCropFormValues = e(this.setCropFormValues, this), this.setCurrentSelection = e(this.setCurrentSelection, this), this.setTrueSize = e(this.setTrueSize, this);
                var n, i, s;
                this.container = $(t), this.spinner = this.container.find(".profile-picture-spinner"), this.img = this.container.find(".js-croppable-avatar"), this.croppedX = this.container.find(".js-crop-cropped_x"), this.croppedY = this.container.find(".js-crop-cropped_y"), this.croppedW = this.container.find(".js-crop-cropped_width"), this.croppedH = this.container.find(".js-crop-cropped_height"), n = this.img.parent("div").width(), s = {
                    aspectRatio: 1,
                    onSelect: this.setCropFormValues,
                    onRelease: this.clearCropFormValues,
                    bgColor: "",
                    maxSize: [3e3, 3e3],
                    boxWidth: n,
                    boxHeight: n
                }, this.setTrueSize(s), this.setCurrentSelection(s), i = this, this.img.Jcrop(s, function() {
                    return i.spinner.addClass("hidden"), i.jcrop = this
                })
            }
            return t.prototype.setTrueSize = function(t) {
                var e, n;
                return n = parseInt(this.img.data("true-width")), e = parseInt(this.img.data("true-height")), 0 !== n && 0 !== e ? t.trueSize = [n, e] : void 0
            }, t.prototype.setCurrentSelection = function(t) {
                var e, n, i, s;
                return n = parseInt(this.croppedW.val()), e = parseInt(this.croppedH.val()), 0 !== n && 0 !== e ? (i = parseInt(this.croppedX.val()), s = parseInt(this.croppedY.val()), t.setSelect = [i, s, i + n, s + e]) : void 0
            }, t.prototype.setCropFormValues = function(t) {
                return this.croppedX.val(t.x), this.croppedY.val(t.y), this.croppedW.val(t.w), this.croppedH.val(t.h)
            }, t.prototype.clearCropFormValues = function() {
                return this.croppedX.val("0"), this.croppedY.val("0"), this.croppedW.val("0"), this.croppedH.val("0")
            }, t
        }(), $.observe(".js-croppable-container", {
            add: function(e) {
                return new t(e)
            }
        }), $(document).on("afterClose.facebox", function() {
            return $(".js-avatar-field").val("")
        })
    }.call(this),
    function() {
        window.d3Ready = function() {
            return "undefined" != typeof d3 && null !== d3 ? Promise.resolve() : new Promise(function(t) {
                return document.addEventListener("graph-lib:loaded", function() {
                    return t()
                })
            })
        }
    }.call(this),
    function() {
        $.observe(".js-ds", function() {
            var t, e;
            (e = this.getAttribute("data-url")) && (t = new XMLHttpRequest, t.open("GET", e, !0), t.setRequestHeader("X-Requested-With", "XMLHttpRequest"), t.send())
        })
    }.call(this),
    function() {
        $(document).on("deferredcontent:error", ".js-deferred-content", function() {
            var t;
            t = $(this).attr("data-deferred-content-error"), t && $(this).find(".js-deferred-content-error").text(t)
        })
    }.call(this),
    function() {
        $(document).on("details:toggled", function(t) {
            var e;
            return e = $(t.target).find("input[autofocus], textarea[autofocus]").last()[0], e && document.activeElement !== e ? e.focus() : void 0
        }), $.hashChange(function(t) {
            return $(t.target).parents(".js-details-container").addClass("open")
        })
    }.call(this),
    function() {
        var t, e;
        $(document).on("reveal.facebox", function() {
            var t, n;
            t = $("#facebox"), n = t.find("input[autofocus], textarea[autofocus]").last()[0], n && document.activeElement !== n && n.focus(), $(document).on("keydown", e)
        }), $(document).on("afterClose.facebox", function() {
            return $(document).off("keydown", e), $("#facebox :focus").blur()
        }), e = function(t) {
            var e, n, i, s, a, r;
            ("tab" === (r = t.hotkey) || "shift+tab" === r) && (t.preventDefault(), n = $("#facebox"), e = n.find("input, .button, textarea").visible(), s = "shift+tab" === t.hotkey ? -1 : 1, i = e.index(e.filter(":focus")), a = i + s, a === e.length || -1 === i && "tab" === t.hotkey ? e.first().focus() : -1 === i ? e.last().focus() : e.get(a).focus())
        }, $.observe("a[rel*=facebox]", t = function() {
            $(this).facebox()
        })
    }.call(this),
    function() {
        $(document).on("click", ".js-flash-close", function() {
            var t;
            return t = $(this).closest(".flash-messages"), $(this).closest(".flash").fadeOut(300, function() {
                return $(this).remove(), 0 === t.find(".flash").length ? t.remove() : void 0
            })
        })
    }.call(this),
    function() {
        var t, e, n, i, s;
        i = new TryStorage(localStorage), e = function(t) {
            var e, s, a, r, o, c, l, u, d, h;
            if ((s = document.getElementById(t)) && (o = document.getElementById("fullscreen_overlay"), c = $(o).find(".js-fullscreen-contents"), u = "gh-fullscreen-theme", "dark" === i.getItem(u) ? ($(".js-fullscreen-overlay").addClass("dark-theme"), l = "dark") : ($(".js-fullscreen-overlay").removeClass("dark-theme"), l = "light"), h = $(s).val(), e = $(s).caret(), $(o).attr("data-return-scroll-position", window.pageYOffset), $("body").addClass("fullscreen-overlay-enabled"), $(document).on("keydown", n), $(c).attr("placeholder", $(s).attr("placeholder")), $(c).val(h), $(c).caret(e), c.focus(), r = "gh-fullscreen-known-user", a = "known" === i.getItem(r), a || i.setItem(r, "known"), i.length)) return d = "other", t.match(/pull_request_body/g) ? d = "pull" : t.match(/issue_body/g) ? d = "issue" : t.match(/blob_contents/g) ? d = "blob" : t.match(/comment_body/g) && (d = "comment"), GitHub.stats({
                zenstats: {
                    unique: !a,
                    use_case: d,
                    theme: l
                }
            })
        }, t = function(t) {
            var e, i, s, a, r, o, c;
            if (s = document.getElementById(t)) return a = document.getElementById("fullscreen_overlay"), o = $(a).find(".js-fullscreen-contents"), c = $(o).val(), e = $(o).caret(), $("body").removeClass("fullscreen-overlay-enabled"), $(document).off("keydown", n), (r = $(a).attr("data-return-scroll-position")) && window.scrollTo(0, r), (i = $(s).parents(".js-code-editor").data("code-editor")) ? i.setCode(c) : ($(s).val(c), $(s).caret(e), $(s).trigger("validation:field:change")), o.val("")
        }, s = !1, n = function(t) {
            return 27 === t.keyCode || "ctrl+L" === t.hotkey || "meta+L" === t.hotkey ? (s ? history.back() : window.location.hash = "", t.preventDefault()) : void 0
        }, $(document).on("click", ".js-exit-fullscreen", function(t) {
            s && (t.preventDefault(), history.back())
        }), $(document).on("click", ".js-theme-switcher", function() {
            var t;
            return $("body, .js-fullscreen-overlay").toggleClass("dark-theme"), t = "gh-fullscreen-theme", "dark" === i.getItem(t) ? i.removeItem(t) : i.setItem(t, "dark"), !1
        }), $.hashChange(function(n) {
            var i, a, r;
            return r = n.oldURL, a = n.newURL, (i = null != a ? a.match(/\#fullscreen_(.+)$/) : void 0) ? (s = !!r, e(i[1])) : (i = null != r ? r.match(/\#fullscreen_(.+)$/) : void 0) ? (s = !1, t(i[1])) : void 0
        }), "dark" === i.getItem("gh-fullscreen-theme") && $(function() {
            return $("body, .js-fullscreen-overlay").addClass("dark-theme")
        })
    }.call(this),
    function() {
        var t, e;
        GitHub.support.emoji || (t = Object.create(HTMLElement.prototype), t.createdCallback = function() {
            return this.textContent = "", this.appendChild(e(this))
        }, e = function(t) {
            var e;
            return e = document.createElement("img"), e.src = t.getAttribute("fallback-src"), e.className = "emoji", e.alt = e.title = ":" + t.getAttribute("alias") + ":", e.height = 20, e.width = 20, e.align = "absmiddle", e
        }, window.GEmojiElement = document.registerElement("g-emoji", {
            prototype: t
        }))
    }.call(this),
    function() {
        var t, e, n, i, s, a, r;
        s = 0, n = -1, e = function(t) {
            var e, n, i, s;
            return e = t.getBoundingClientRect(), i = $(window).height(), s = $(window).width(), 0 === e.height ? !1 : e.height < i ? e.top >= 0 && e.left >= 0 && e.bottom <= i && e.right <= s : (n = Math.ceil(i / 2), e.top >= 0 && e.top + n < i)
        }, t = function(t) {
            var n, i, s, a, r, o, c;
            for (a = t.elements, c = [], i = 0, s = a.length; s > i; i++) n = a[i], c.push(e(n) ? null != (r = t["in"]) ? r.call(n, n, t) : void 0 : null != (o = t.out) ? o.call(n, n, t) : void 0);
            return c
        }, r = function(e) {
            return document.hasFocus() && window.scrollY !== n && (n = window.scrollY, !e.checkPending) ? (e.checkPending = !0, window.requestAnimationFrame(function() {
                return e.checkPending = !1, t(e)
            })) : void 0
        }, i = function(e, n) {
            return 0 === n.elements.length && (window.addEventListener("scroll", n.scrollHandler), $.pageFocused().then(function() {
                return t(n)
            })), n.elements.push(e)
        }, a = function(t, e) {
            var n;
            return n = e.elements.indexOf(t), -1 !== n && e.elements.splice(n, 1), 0 === e.elements.length ? window.removeEventListener("scroll", e.scrollHandler) : void 0
        }, $.inViewport = function(t, e) {
            var n;
            return null != e.call && (e = {
                "in": e
            }), n = {
                id: s++,
                selector: t,
                "in": e["in"],
                out: e.out,
                elements: [],
                checkPending: !1
            }, n.scrollHandler = function() {
                return r(n)
            }, $.observe(t, {
                add: function(t) {
                    return i(t, n)
                },
                remove: function(t) {
                    return a(t, n)
                }
            }), n
        }
    }.call(this),
    function() {
        $.observe(".labeled-button:checked", {
            add: function() {
                return $(this).parent("label").addClass("selected")
            },
            remove: function() {
                return $(this).parent("label").removeClass("selected")
            }
        })
    }.call(this),
    function() {
        $(document).on("keydown", "div.minibutton, span.minibutton", function(t) {
            return "enter" === t.hotkey ? ($(this).click(), t.preventDefault()) : void 0
        })
    }.call(this),
    function() {
        $(document).on("ajaxSuccess", ".js-notice-dismiss", function() {
            return $(this).closest(".js-notice").fadeOut()
        })
    }.call(this),
    function() {
        $.observeLast = function(t, e) {
            var n, i;
            null == e && (e = "last"), n = i = function() {
                $(t).removeClass(e).last().addClass(e)
            }, $.observe(t, {
                add: n,
                remove: i
            })
        }
    }.call(this),
    function() {
        $(document).on("click", ".js-permalink-shortcut", function() {
            return window.location = this.href + window.location.hash, !1
        })
    }.call(this),
    function() {
        $(document).on("pjax:start", function(t) {
            var e;
            (e = t.relatedTarget) && ($(e).addClass("pjax-active"), $(e).parents(".js-pjax-active").addClass("pjax-active"))
        }), $(document).on("pjax:end", function() {
            $(".pjax-active").removeClass("pjax-active")
        })
    }.call(this),
    function() {
        $(document).on("pjax:click", function() {
            return window.onbeforeunload ? !1 : void 0
        })
    }.call(this),
    function() {
        var t;
        t = function() {
            var t, e;
            return e = function() {
                var e, n, i;
                for (i = [], e = 0, n = arguments.length; n > e; e++) t = arguments[e], i.push(t.split("/", 3).join("/"));
                return i
            }.apply(this, arguments), e[0] === e[1]
        }, $(document).on("pjax:click", "#js-repo-pjax-container a[href]", function() {
            var e;
            return e = $(this).prop("pathname"), t(e, location.pathname) ? void 0 : !1
        })
    }.call(this),
    function() {
        var t;
        $.support.pjax && ($.pjax.defaults.fragment = "#pjax-body", $.pjaxHeadCache = [], $(t = function() {
            return $.pjaxHeadCache[document.location.pathname] = $("head [data-pjax-transient]")
        }), $(document).on("pjax:success", function(t, e) {
            var n, i, s;
            return s = $.parseHTML(e), i = s[0], "pjax-head" === i.id && ($.pjaxHeadCache[document.location.pathname] = $(i).children()), n = s[2], "pjax-flash" === (null != n ? n.id : void 0) ? $("#js-flash-container").html(n) : void 0
        }), $(document).on("pjax:end", function() {
            var t, e, n;
            return t = $.pjaxHeadCache[document.location.pathname], t ? ($("head [data-pjax-transient]").remove(), n = $(t).not("title, script, link[rel='stylesheet']"), e = $(t).filter("link[rel='stylesheet']"), $(document.head).append(n.attr("data-pjax-transient", !0)), $(document.head).append(e)) : void 0
        }))
    }.call(this),
    function() {
        var t;
        $.support.pjax && (t = function(t) {
            return $(t).is("[data-pjax-preserve-scroll]") ? !1 : 0
        }, $(document).on("click", "[data-pjax] a, a[data-pjax]", function(e) {
            var n, i;
            if (!$(this).is("[data-skip-pjax]") && !$(this).is("[data-remote]")) return i = t(this), (n = $(this).closest("[data-pjax-container]")[0]) ? $.pjax.click(e, {
                container: n,
                scrollTo: i
            }) : void 0
        }), $(document).on("submit", "form[data-pjax]", function(e) {
            var n, i;
            return i = t(this), (n = $(this).closest("[data-pjax-container]")[0]) ? $.pjax.submit(e, {
                container: n,
                scrollTo: i
            }) : void 0
        }))
    }.call(this),
    function() {
        var t;
        $.support.pjax && (t = document.querySelector("meta[name=pjax-timeout]")) && ($.pjax.defaults.timeout = parseInt(t.content))
    }.call(this),
    function() {
        $.observe(".js-poll", function(t) {
            $.ajaxPoll({
                context: t,
                url: $(t).attr("data-url")
            })
        })
    }.call(this),
    function() {
        $(function() {
            return $(document.body).hasClass("js-print-popup") ? (window.print(), setTimeout(window.close, 1e3)) : void 0
        })
    }.call(this),
    function() {
        $(document).onFocusedKeydown(".js-quick-submit", function() {
            return function(t) {
                var e, n;
                return "ctrl+enter" === t.hotkey || "meta+enter" === t.hotkey ? (n = $(this).closest("form"), e = n.find("input[type=submit], button[type=submit]").first(), e.prop("disabled") || n.submit(), !1) : void 0
            }
        })
    }.call(this),
    function() {
        $(document).on("click", ".js-reload", function() {
            return window.location.reload(), !1
        })
    }.call(this),
    function() {
        $.observe(".has-removed-contents", function() {
            var t, e, n;
            return t = $(this).contents(), e = function() {
                return t.detach()
            }, n = function() {
                return $(this).html(t)
            }, {
                add: e,
                remove: n
            }
        })
    }.call(this),
    function() {
        $(document).on("focusin", ".js-repo-filter .js-filterable-field", function() {
            return $(this).closest(".js-repo-filter").find(".js-more-repos-link").click()
        }), $(document).on("click", ".js-repo-filter .js-repo-filter-tab", function() {
            var t;
            return t = $(this).closest(".js-repo-filter"), t.find(".js-more-repos-link").click(), t.find(".js-repo-filter-tab").removeClass("filter-selected"), $(this).addClass("filter-selected"), t.find(".js-filterable-field").fire("filterable:change"), !1
        }), $(document).on("filterable:change", ".js-repo-filter .js-repo-list", function() {
            var t, e;
            t = $(this).closest(".js-repo-filter"), (e = t.find(".js-repo-filter-tab.filter-selected").attr("data-filter")) && $(this).children().not(e).hide()
        }), $(document).on("click:prepare", ".js-repo-filter .js-more-repos-link", function() {
            return $(this).hasClass("is-loading") ? !1 : void 0
        }), $(document).on("ajaxSend", ".js-repo-filter .js-more-repos-link", function() {
            return $(this).addClass("is-loading")
        }), $(document).on("ajaxComplete", ".js-repo-filter .js-more-repos-link", function() {
            return $(this).removeClass("is-loading")
        }), $(document).on("ajaxSuccess", ".js-repo-filter .js-more-repos-link", function(t, e, n, i) {
            var s;
            return s = $(this).closest(".js-repo-filter"), s.find(".js-repo-list").html(i), s.find(".js-filterable-field").fire("filterable:change"), $(this).remove()
        })
    }.call(this),
    function() {
        $(document).on("ajaxSuccess", ".js-select-menu:not([data-multiple])", function() {
            return $(this).menu("deactivate")
        }), $(document).on("ajaxSend", ".js-select-menu:not([data-multiple])", function() {
            return $(this).addClass("is-loading")
        }), $(document).on("ajaxComplete", ".js-select-menu", function() {
            return $(this).removeClass("is-loading")
        }), $(document).on("ajaxError", ".js-select-menu", function() {
            return $(this).addClass("has-error")
        }), $(document).on("menu:deactivate", ".js-select-menu", function() {
            return $(this).removeClass("is-loading has-error")
        })
    }.call(this),
    function() {
        $(document).on("navigation:open", ".js-select-menu:not([data-multiple]) .js-navigation-item", function() {
            var t, e;
            return e = $(this), t = e.closest(".js-select-menu"), t.find(".js-navigation-item.selected").removeClass("selected"), e.addClass("selected"), e.removeClass("indeterminate"), e.find("input[type=radio], input[type=checkbox]").prop("checked", !0).change(), e.fire("selectmenu:selected"), t.hasClass("is-loading") ? void 0 : t.menu("deactivate")
        }), $(document).on("navigation:open", ".js-select-menu[data-multiple] .js-navigation-item", function() {
            var t, e;
            return t = $(this), e = t.hasClass("selected"), t.toggleClass("selected", !e), t.removeClass("indeterminate"), t.find("input[type=radio], input[type=checkbox]").prop("checked", !e).change(), t.fire("selectmenu:selected")
        })
    }.call(this),
    function() {
        $(document).on("selectmenu:selected", ".js-select-menu .js-navigation-item", function() {
            var t, e, n;
            return t = $(this).closest(".js-select-menu"), n = $(this).find(".js-select-button-text"), n[0] && t.find(".js-select-button").html(n.html()), e = $(this).find(".js-select-menu-item-gravatar"), n[0] ? t.find(".js-select-button-gravatar").html(e.html()) : void 0
        })
    }.call(this),
    function() {
        $(document).on("selectmenu:change", ".js-select-menu .select-menu-list", function(t) {
            var e, n;
            n = $(this).find(".js-navigation-item"), n.removeClass("last-visible"), n.visible().last().addClass("last-visible"), $(this).is("[data-filterable-for]") || (e = $(t.target).hasClass("filterable-empty"), $(this).toggleClass("filterable-empty", e))
        })
    }.call(this),
    function() {
        $(document).on("menu:activated selectmenu:load", ".js-select-menu", function() {
            return $(this).find(".js-filterable-field").focus()
        }), $(document).on("menu:deactivate", ".js-select-menu", function() {
            return $(this).find(".js-filterable-field").val("").trigger("filterable:change")
        })
    }.call(this),
    function() {
        var t;
        t = function(t) {
            var e, n, i, s, a;
            return i = t.currentTarget, e = $(i), e.removeClass("js-load-contents"), e.addClass("is-loading"), e.removeClass("has-error"), s = e.attr("data-contents-url"), n = e.data("contents-data"), a = $.ajax({
                url: s,
                data: n
            }), a.then(function(t) {
                e.removeClass("is-loading"), e.find(".js-select-menu-deferred-content").html(t), e.hasClass("active") && e.fire("selectmenu:load")
            }, function() {
                e.removeClass("is-loading"), e.addClass("has-error")
            })
        }, $.observe(".js-select-menu.js-load-contents", {
            add: function() {
                $(this).on("mouseenter", t), $(this).on("menu:activate", t)
            },
            remove: function() {
                $(this).off("mouseenter", t), $(this).off("menu:activate", t)
            }
        })
    }.call(this),
    function() {
        $(document).on("menu:activate", ".js-select-menu", function() {
            return $(this).find(":focus").blur(), $(this).find(".js-menu-target").addClass("selected"), $(this).find(".js-navigation-container").navigation("push")
        }), $(document).on("menu:deactivate", ".js-select-menu", function() {
            return $(this).find(".js-menu-target").removeClass("selected"), $(this).find(".js-navigation-container").navigation("pop")
        }), $(document).on("filterable:change selectmenu:tabchange", ".js-select-menu .select-menu-list", function() {
            return $(this).navigation("refocus")
        })
    }.call(this),
    function() {
        var t;
        $(document).on("filterable:change", ".js-select-menu .select-menu-list", function(e) {
            var n, i, s, a;
            (i = this.querySelector(".js-new-item-form")) && (n = e.relatedTarget.value, "" === n || t(this, n) ? $(this).removeClass("is-showing-new-item-form") : ($(this).addClass("is-showing-new-item-form"), s = i.querySelector(".js-new-item-name"), "innerText" in s ? s.innerText = n : s.textContent = n, null != (a = i.querySelector(".js-new-item-value")) && (a.value = n))), $(e.target).trigger("selectmenu:change")
        }), t = function(t, e) {
            var n, i, s, a, r;
            for (r = t.querySelectorAll(".js-select-button-text"), s = 0, a = r.length; a > s; s++)
                if (n = r[s], i = n.textContent.toLowerCase().trim(), i === e.toLowerCase()) return !0;
            return !1
        }
    }.call(this),
    function() {
        var t;
        $(document).on("menu:activate selectmenu:load", ".js-select-menu", function() {
            var t;
            return t = $(this).find(".js-select-menu-tab"), t.removeClass("selected"), t.first().addClass("selected")
        }), $(document).on("click", ".js-select-menu .js-select-menu-tab", function() {
            var t;
            return t = $(this).closest(".js-select-menu"), t.find(".js-select-menu-tab.selected").removeClass("selected"), $(this).addClass("selected"), !1
        }), t = function(t, e) {
            var n, i, s;
            s = t.getAttribute("data-tab-filter"), i = $(t).closest(".js-select-menu").find(".js-select-menu-tab-bucket"), n = i.filter(function() {
                return this.getAttribute("data-tab-filter") === s
            }), n.toggleClass("selected", e), e && n.fire("selectmenu:tabchange")
        }, $.observe(".js-select-menu .js-select-menu-tab.selected", {
            add: function() {
                return t(this, !0)
            },
            remove: function() {
                return t(this, !1)
            }
        })
    }.call(this),
    function() {}.call(this),
    function() {
        var t, e, n, i, s;
        i = new TryStorage(sessionStorage), t = function(t) {
            var e;
            return null == t && (t = window.location), (e = document.querySelector("meta[name=session-resume-id]")) ? e.content : t.pathname
        }, s = null, window.addEventListener("submit", function(t) {
            s = t.target, setImmediate(function() {
                return t.defaultPrevented ? s = null : void 0
            })
        }, !0), e = function(t) {
            var e, n, a, r;
            a = "session-resume:" + t, r = function(t) {
                return t.id && t.value !== t.defaultValue && t.form !== s
            }, n = function() {
                var t, n, i, s;
                for (i = $(".js-session-resumable"), s = [], t = 0, n = i.length; n > t; t++) e = i[t], r(e) && s.push([e.id, e.value]);
                return s
            }(), n.length && i.setItem(a, JSON.stringify(n))
        }, n = function(t) {
            var e, n, s, a, r, o, c;
            if (n = "session-resume:" + t, e = i.getItem(n))
                for (i.removeItem(n), o = JSON.parse(e), a = 0, r = o.length; r > a; a++) c = o[a], t = c[0], s = c[1], $(document).fire("session:resume", {
                    targetId: t,
                    targetValue: s
                }, function() {
                    var e;
                    e = document.getElementById(t), e && e.value === e.defaultValue && (e.value = s)
                })
        }, $(window).on("pageshow pjax:end", function() {
            n(t())
        }), $(window).on("pagehide", function() {
            e(t())
        }), $(window).on("pjax:beforeReplace", function(n) {
            var i, s, a, r;
            (a = null != (r = n.previousState) ? r.url : void 0) ? (s = t(new URL(a)), e(s)) : (i = new Error("pjax:beforeReplace event.previousState.url is undefined"), setImmediate(function() {
                throw i
            }))
        })
    }.call(this),
    function() {
        $(document).on("ajaxSuccess", ".js-social-container", function(t, e, n, i) {
            return $(this).find(".js-social-count").text(i.count)
        })
    }.call(this),
    function() {
        var t, e = function(t, e) {
                return function() {
                    return t.apply(e, arguments)
                }
            },
            n = [].slice;
        "undefined" != typeof EventSource && null !== EventSource && (navigator.userAgent.match(/iPhone/) || (t = function() {
            function t(t) {
                this.base = t, this.flush = e(this.flush, this), this.setup = e(this.setup, this), this.readyState = this.CONNECTING, this.listeners = {}, setImmediate(this.setup)
            }
            return t.prototype.CONNECTING = 0, t.prototype.OPEN = 1, t.prototype.CLOSED = 2, t.prototype.setup = function() {
                var t, e;
                (e = this.popMessages()) && (t = {
                    message: e
                }), $.ajax({
                    type: "POST",
                    url: this.base,
                    data: t,
                    success: function(t) {
                        return function(e, n, i) {
                            var s;
                            return (s = i.getResponseHeader("Location")) ? (t.pollUrl = s, t.messageUrl = "" + t.pollUrl + "/message") : (t.pollUrl = e.pollUrl, t.messageUrl = e.messageUrl), t.pollUrl ? (t.readyState = t.OPEN, t.fire("open"), t.readyState === t.OPEN ? (t.flush(), t.start()) : void 0) : t.close()
                        }
                    }(this),
                    error: function(t) {
                        return function() {
                            return t.close()
                        }
                    }(this)
                })
            }, t.prototype.start = function() {
                this.source = new EventSource(this.pollUrl), this.source.addEventListener("message", function(t) {
                    return function(e) {
                        var n;
                        n = JSON.parse(e.data), t.fire("message", n)
                    }
                }(this)), this.source.addEventListener("reopen", function(t) {
                    return function() {
                        t.fire("reopen")
                    }
                }(this)), this.source.addEventListener("error", function(t) {
                    return function() {
                        t.source.readyState === EventSource.CLOSED && t.close()
                    }
                }(this))
            }, t.prototype.on = function(t, e) {
                var n;
                return null == (n = this.listeners)[t] && (n[t] = []), this.listeners[t].push(e), this
            }, t.prototype.fire = function() {
                var t, e, i, s, a, r;
                if (s = arguments[0], t = 2 <= arguments.length ? n.call(arguments, 1) : [], i = this.listeners[s])
                    for (a = 0, r = i.length; r > a; a++) e = i[a], e.apply(this, t)
            }, t.prototype.close = function() {
                var t;
                this.readyState = this.CLOSED, null != (t = this.source) && t.close(), this.source = null, this.pollUrl = null, this.messageUrl = null, this.fire("close")
            }, t.prototype.send = function(t) {
                null == this.outbox && (this.outbox = []), this.outbox.push(t), this.fire("send", t), this.readyState === this.OPEN && null == this.flushTimeout && (this.flushTimeout = setTimeout(this.flush, 0))
            }, t.prototype.flush = function() {
                var t;
                this.messageUrl && (this.flushTimeout = null, (t = this.popMessages()) && $.ajax({
                    type: "POST",
                    url: this.messageUrl,
                    data: {
                        message: t
                    },
                    error: function(t) {
                        return function() {
                            return t.close()
                        }
                    }(this)
                }))
            }, t.prototype.popMessages = function() {
                var t;
                if (this.outbox) return t = this.outbox, this.outbox = null, t
            }, t
        }(), $.socket = function(e) {
            return new t(e)
        }))
    }.call(this),
    function() {
        $.socket && ($.fn.socket = function() {
            var t, e;
            if ((t = this[0]) && $(t).is("link[rel=xhr-socket]")) return e = $(t).data("socket"), e && e.readyState !== e.CLOSED ? e : (e = $.socket(t.href), e.on("open", function() {
                return $(t).trigger("socket:open", [this])
            }), e.on("close", function() {
                return $(t).trigger("socket:close", [this])
            }), e.on("reopen", function() {
                return $(t).trigger("socket:reopen", [this])
            }), e.on("send", function(e) {
                return $(t).trigger("socket:send", [e, this])
            }), e.on("message", function(e) {
                return $(t).trigger("socket:message", [e, this])
            }), $(t).data("socket", e), e)
        })
    }.call(this),
    function() {
        var t, e, n, i, s, a, r;
        $.fn.socket && (s = {}, t = {}, r = null, n = function() {
            var t;
            return null != r ? r : r = (t = $(document.head).find("link[rel=xhr-socket]")[0]) ? $(t).socket() : !1
        }, e = function(t) {
            var e, n;
            return null != (e = null != (n = t.getAttribute("data-channel")) ? n.split(/\s+/) : void 0) ? e : []
        }, i = function(i) {
            var a, r, o, c, l;
            if (r = n())
                for (l = e(i), o = 0, c = l.length; c > o; o++) a = l[o], s[a] || (r.send({
                    subscribe: a
                }), s[a] = !0), null == t[a] && (t[a] = []), t[a].push(i)
        }, a = function(n) {
            var i, s, a, r;
            for (r = e(n), s = 0, a = r.length; a > s; s++) i = r[s], t[i] = $(t[i]).not(n).slice(0)
        }, $(document).on("socket:reopen", "link[rel=xhr-socket]", function(t, e) {
            var n, i;
            for (n in s) i = s[n], e.send({
                subscribe: n
            })
        }), $(document).on("socket:message", "link[rel=xhr-socket]", function(e, n) {
            var i, s;
            s = n[0], i = n[1], s && i && $(t[s]).trigger("socket:message", [i, s])
        }), $.observe(".js-socket-channel[data-channel]", {
            add: i,
            remove: a
        }))
    }.call(this),
    function() {
        var t, e, n, i, s, a, r, o, c, l, u, d, h = function(t, e) {
            return function() {
                return t.apply(e, arguments)
            }
        };
        u = function(t, e, n) {
            var i, s, a, r;
            return r = n[3], s = n[4], a = e - s.length, i = e, {
                type: t,
                text: r,
                query: s,
                startIndex: a,
                endIndex: i
            }
        }, t = function() {
            function t(t) {
                this.textarea = t, this.deactivate = h(this.deactivate, this), this.onNavigationOpen = h(this.onNavigationOpen, this), this.onNavigationKeyDown = h(this.onNavigationKeyDown, this), this.onInput = h(this.onInput, this), this.onPaste = h(this.onPaste, this), this.teardown = h(this.teardown, this), $(this.textarea).on("focusout:delayed.suggester", this.teardown), $(this.textarea.form).on("reset.suggester", this.deactivate), $(this.textarea).on("paste.suggester", this.onPaste), $(this.textarea).on("input.suggester", this.onInput), this.suggester = $(this.textarea).closest(".js-suggester-container").find(".js-suggester")[0], $(this.suggester).on("navigation:keydown.suggester", "[data-value]", this.onNavigationKeyDown), $(this.suggester).on("navigation:open.suggester", "[data-value]", this.onNavigationOpen), this.loadSuggestions()
            }
            var e, i;
            return t.prototype.types = {
                mention: {
                    match: /(^|\s)(@([a-z0-9\-_\/]*))$/i,
                    replace: "$1@$value ",
                    search: function(t, e) {
                        var i, s, a;
                        return a = o(e), i = $(t).find("ul.mention-suggestions"), s = i.fuzzyFilterSortList(e, {
                            limit: 5,
                            text: n,
                            score: a.score
                        }), Promise.resolve([i, s])
                    }
                },
                auditLogUser: {
                    match: /(^|\s)((\-?actor:|\-?user:)([a-z0-9\-\+_]*))$/i,
                    replace: "$1$3$value ",
                    search: function(t, e) {
                        var n, i;
                        return n = $(t).find("ul.user-suggestions"), i = n.fuzzyFilterSortList(e, {
                            limit: 5
                        }), Promise.resolve([n, i])
                    },
                    normalizeMatch: u
                },
                auditLogAction: {
                    match: /(^|\s)((\-?action:)([a-z0-9\.\-\+_]*))$/i,
                    replace: "$1$3$value ",
                    search: function(t, e) {
                        var n, i;
                        return n = $(t).find("ul.action-suggestions"), i = n.fuzzyFilterSortList(e, {
                            limit: 5
                        }), Promise.resolve([n, i])
                    },
                    normalizeMatch: u
                },
                auditLogRepo: {
                    match: /(^|\s)((\-?repo:)([a-z0-9\/\-\+_]*))$/i,
                    replace: "$1$3$value ",
                    search: function(t, e) {
                        var n, i;
                        return n = $(t).find("ul.repo-suggestions"), i = n.fuzzyFilterSortList(e, {
                            limit: 5
                        }), Promise.resolve([n, i])
                    },
                    normalizeMatch: u
                },
                auditLogCountry: {
                    match: /(^|\s)((\-?country:)([a-z0-9\-\+_]*))$/i,
                    replace: "$1$3$value ",
                    search: function(t, e) {
                        var n, i;
                        return n = $(t).find("ul.country-suggestions"), i = n.fuzzyFilterSortList(e, {
                            limit: 5
                        }), Promise.resolve([n, i])
                    },
                    normalizeMatch: u
                },
                emoji: {
                    match: /(^|\s)(:([a-z0-9\-\+_]*))$/i,
                    replace: "$1:$value: ",
                    search: function(t, e) {
                        var n, i;
                        return n = $(t).find("ul.emoji-suggestions"), e = " " + e.toLowerCase().replace(/_/g, " "), i = n.fuzzyFilterSortList(e, {
                            limit: 5,
                            text: a,
                            score: s
                        }), Promise.resolve([n, i])
                    }
                },
                hashed: {
                    match: /(^|\s)(\#([a-z0-9\-_\/]*))$/i,
                    replace: "$1#$value ",
                    search: function(t, e) {
                        var i, s, a, r;
                        return s = $(t).find("ul.hashed-suggestions"), i = /^\d+$/.test(e) ? (a = new RegExp("\\b" + e), function(t) {
                            return l(t, a)
                        }) : o(e).score, r = s.fuzzyFilterSortList(e, {
                            limit: 5,
                            text: n,
                            score: i
                        }), Promise.resolve([s, r])
                    }
                }
            }, i = function(t) {
                return t.replace(/`{3,}[^`]*\n(.+)?\n`{3,}/g, "")
            }, e = function(t) {
                var e, n;
                return (null != (e = t.match(/`{3,}/g)) ? e.length : void 0) % 2 ? !0 : (null != (n = i(t).match(/`/g)) ? n.length : void 0) % 2 ? !0 : void 0
            }, t.prototype.teardown = function() {
                this.deactivate(), $(this.textarea).off(".suggester"), $(this.textarea.form).on(".suggester"), $(this.suggester).off(".suggester")
            }, t.prototype.onPaste = function() {
                this.deactivate(), this.justPasted = !0
            }, t.prototype.onInput = function() {
                return this.justPasted ? void(this.justPasted = !1) : this.checkQuery() ? !1 : void 0
            }, t.prototype.onNavigationKeyDown = function(t) {
                switch (t.hotkey) {
                    case "tab":
                        return this.onNavigationOpen(t), !1;
                    case "esc":
                        return this.deactivate(), t.stopImmediatePropagation(), !1
                }
            }, t.prototype.onNavigationOpen = function(t) {
                var e, n, i, s;
                return s = $(t.target).attr("data-value"), i = this.textarea.value.substring(0, this.currentSearch.endIndex), n = this.textarea.value.substring(this.currentSearch.endIndex), i = i.replace(this.currentSearch.type.match, this.currentSearch.type.replace.replace("$value", s)), this.textarea.value = i + n, this.deactivate(), this.textarea.focus(), this.textarea.selectionStart = i.length, this.textarea.selectionEnd = i.length, (e = this.currentSearch.text.match(/^#(\d+$)?/)) && (window.ga("send", "event", "Suggester", "complete", "search"), e[1]) ? window.ga("send", "event", "Suggester", "complete", "number search") : void 0
            }, t.prototype.checkQuery = function() {
                var t, e;
                if (t = this.searchQuery()) {
                    if (t.query === (null != (e = this.currentSearch) ? e.query : void 0)) return;
                    return this.currentSearch = t, this.search(t.type, t.query).then(function(e) {
                        return function(n) {
                            return n ? e.activate(t.startIndex) : e.deactivate()
                        }
                    }(this)), this.currentSearch.query
                }
                this.currentSearch = null, this.deactivate()
            }, t.prototype.activate = function(t) {
                $(this.suggester).css($(this.textarea).textFieldSelectionPosition(t + 1)), $(this.suggester).hasClass("active") || ($(this.suggester).addClass("active"), $(this.textarea).addClass("js-navigation-enable"), $(this.suggester).navigation("push"), $(this.suggester).navigation("focus"))
            }, t.prototype.deactivate = function() {
                $(this.suggester).hasClass("active") && ($(this.suggester).removeClass("active"), $(this.suggester).find(".suggestions").hide(), $(this.textarea).removeClass("js-navigation-enable"), $(this.suggester).navigation("pop"))
            }, t.prototype.search = function(t, e) {
                return t.search(this.suggester, e).then(function(t) {
                    return function(e) {
                        var n, i;
                        return n = e[0], i = e[1], i > 0 ? (n.show(), $(t.suggester).navigation("focus"), !0) : !1
                    }
                }(this))
            }, t.prototype.searchQuery = function() {
                var t, n, i, s, a, r, o;
                if (s = this.textarea.selectionEnd, a = this.textarea.value.substring(0, s), !e(a)) {
                    o = this.types;
                    for (i in o)
                        if (r = o[i], t = a.match(r.match)) return n = null != r.normalizeMatch ? r.normalizeMatch(r, s, t) : this.normalizeMatch(r, s, t)
                }
            }, t.prototype.normalizeMatch = function(t, e, n) {
                var i, s, a, r;
                return r = n[2], s = n[3], a = e - r.length, i = e, {
                    type: t,
                    text: r,
                    query: s,
                    startIndex: a,
                    endIndex: i
                }
            }, t.prototype.loadSuggestions = function() {
                var t, e;
                if (!$(this.suggester).children().length && (t = $(this.suggester).attr("data-url"), null != t)) return e = $.ajax({
                    url: t
                }), e.then(function(t) {
                    return function(e) {
                        return $(t.suggester).html(e), t.currentSearch = null, t.checkQuery()
                    }
                }(this))
            }, t
        }(), i = {}, a = function(t) {
            var e;
            return e = t.getAttribute("data-value"), i[e] = " " + n(t).replace(/_/g, " "), e
        }, n = function(t) {
            return t.getAttribute("data-text").trim().toLowerCase()
        }, s = function(t, e) {
            var n;
            return n = i[t].indexOf(e), n > -1 ? 1e3 - n : 0
        }, l = function(t, e) {
            var n;
            return n = t.search(e), n > -1 ? 1e3 - n : 0
        }, d = function(t, n) {
            var i, s, a, r, o, l, u;
            if (o = e(t, n[0]), 0 !== o.length) {
                if (1 === n.length) return [o[0], 1, []];
                for (a = null, l = 0, u = o.length; u > l; l++) r = o[l], (i = c(t, n, r + 1)) && (s = i[i.length - 1] - r, (!a || s < a[1]) && (a = [r, s, i]));
                return a
            }
        }, e = function(t, e) {
            var n, i;
            for (n = 0, i = [];
                (n = t.indexOf(e, n)) > -1;) i.push(n++);
            return i
        }, c = function(t, e, n) {
            var i, s, a, r;
            for (s = [], i = a = 1, r = e.length; r >= 1 ? r > a : a > r; i = r >= 1 ? ++a : --a) {
                if (n = t.indexOf(e[i], n), -1 === n) return;
                s.push(n++)
            }
            return s
        }, r = function() {
            return 2
        }, o = function(t) {
            var e, n;
            return t ? (e = t.toLowerCase().split(""), n = function(n) {
                var i, s;
                return n && (i = d(n, e)) ? (s = t.length / i[1], s /= i[0] / 2 + 1) : 0
            }) : n = r, {
                score: n
            }
        }, $(document).on("focusin:delayed", ".js-suggester-field", function() {
            new t(this)
        })
    }.call(this),
    function() {
        var t;
        $(document).on("tasklist:change", ".js-task-list-container", function() {
            this.classList.add("is-updating-task-list")
        }), $(document).on("tasklist:changed", ".js-task-list-container", function(t, e, n) {
            var i, s, a, r;
            return s = $(this).find("form.js-comment-update"), a = s.find("input[name=task_list_key]"), a.length > 0 || (r = s.find(".js-task-list-field").attr("name").split("[")[0], a = $("<input>", {
                type: "hidden",
                name: "task_list_key",
                value: r
            }), s.append(a)), n = n ? "1" : "0", i = $("<input>", {
                type: "hidden",
                name: "task_list_checked",
                value: n
            }), s.append(i), s.one("ajaxComplete", function() {
                return i.remove()
            }), s.submit()
        }), $(document).on("ajaxSuccess", ".js-task-list-container", function(t) {
            $(t.target).is("form.js-comment-update") && this.classList.remove("is-updating-task-list")
        }), t = function(t) {
            t && $(t).taskList(t.classList.contains("is-updating-task-list") ? "disable" : "enable")
        }, $.observe(".js-task-list-container:not(.is-updating-task-list)", {
            add: function() {
                return t(this)
            },
            remove: function() {
                return t(this)
            }
        }), $.observe(".task-list-item-checkbox", {
            add: function() {
                return t($(this).closest(".js-task-list-container")[0])
            },
            remove: function() {
                return t($(this).closest(".js-task-list-container")[0])
            }
        })
    }.call(this),
    function() {
        var t, e, n;
        t = function() {
            var t, i, s, a, r, o;
            if (o = this.getAttribute("data-url")) return r = $.ajax({
                url: o,
                dataType: "json"
            }), s = this.getAttribute("data-id"), a = $(".js-team-mention[data-id='" + s + "']"), a.removeAttr("data-url"), t = function(t) {
                return t.total > t.members.length && t.members.push("" + (t.total - t.members.length) + " more"), n(a, e(t.members))
            }, i = function() {
                return n(a, "Failed to load team members")
            }, r.then(t, i)
        }, n = function(t, e) {
            return t.attr("aria-label", e), t.addClass("tooltipped tooltipped-s tooltipped-multiline")
        }, e = function(t) {
            var e;
            return 0 === t.length ? "" : 1 === t.length ? t[0] : 2 === t.length ? t.join(" and ") : ([].splice.apply(t, [-1, 9e9].concat(e = "and " + t.slice(-1))), t.join(", "))
        }, $.observe(".js-team-mention", function() {
            return $(this).on("mouseenter", t)
        })
    }.call(this),
    function() {
        $(document).on("ajaxBeforeSend", function(t, e, n) {
            var i;
            n.crossDomain || (i = $(".js-timeline-marker"), i.length && e.setRequestHeader("X-Timeline-Last-Modified", i.attr("data-last-modified")))
        })
    }.call(this),
    /**
     * This script gives you the zone info key representing your device's time zone setting.
     *
     * @name jsTimezoneDetect
     * @version 1.0.5
     * @author Jon Nylander
     * @license MIT License - http://www.opensource.org/licenses/mit-license.php
     *
     * For usage and examples, visit:
     * http://pellepim.bitbucket.org/jstz/
     *
     * Copyright (c) Jon Nylander
     */
    function(t) {
        var e = function() {
            "use strict";
            var t = "s",
                n = function(t) {
                    var e = -t.getTimezoneOffset();
                    return null !== e ? e : 0
                },
                i = function(t, e, n) {
                    var i = new Date;
                    return void 0 !== t && i.setFullYear(t), i.setMonth(e), i.setDate(n), i
                },
                s = function(t) {
                    return n(i(t, 0, 2))
                },
                a = function(t) {
                    return n(i(t, 5, 2))
                },
                r = function(t) {
                    var e = t.getMonth() > 7,
                        i = e ? a(t.getFullYear()) : s(t.getFullYear()),
                        r = n(t),
                        o = 0 > i,
                        c = i - r;
                    return o || e ? 0 !== c : 0 > c
                },
                o = function() {
                    var e = s(),
                        n = a(),
                        i = e - n;
                    return 0 > i ? e + ",1" : i > 0 ? n + ",1," + t : e + ",0"
                },
                c = function() {
                    var t = o();
                    return new e.TimeZone(e.olson.timezones[t])
                },
                l = function(t) {
                    var e = new Date(2010, 6, 15, 1, 0, 0, 0),
                        n = {
                            "America/Denver": new Date(2011, 2, 13, 3, 0, 0, 0),
                            "America/Mazatlan": new Date(2011, 3, 3, 3, 0, 0, 0),
                            "America/Chicago": new Date(2011, 2, 13, 3, 0, 0, 0),
                            "America/Mexico_City": new Date(2011, 3, 3, 3, 0, 0, 0),
                            "America/Asuncion": new Date(2012, 9, 7, 3, 0, 0, 0),
                            "America/Santiago": new Date(2012, 9, 3, 3, 0, 0, 0),
                            "America/Campo_Grande": new Date(2012, 9, 21, 5, 0, 0, 0),
                            "America/Montevideo": new Date(2011, 9, 2, 3, 0, 0, 0),
                            "America/Sao_Paulo": new Date(2011, 9, 16, 5, 0, 0, 0),
                            "America/Los_Angeles": new Date(2011, 2, 13, 8, 0, 0, 0),
                            "America/Santa_Isabel": new Date(2011, 3, 5, 8, 0, 0, 0),
                            "America/Havana": new Date(2012, 2, 10, 2, 0, 0, 0),
                            "America/New_York": new Date(2012, 2, 10, 7, 0, 0, 0),
                            "Europe/Helsinki": new Date(2013, 2, 31, 5, 0, 0, 0),
                            "Pacific/Auckland": new Date(2011, 8, 26, 7, 0, 0, 0),
                            "America/Halifax": new Date(2011, 2, 13, 6, 0, 0, 0),
                            "America/Goose_Bay": new Date(2011, 2, 13, 2, 1, 0, 0),
                            "America/Miquelon": new Date(2011, 2, 13, 5, 0, 0, 0),
                            "America/Godthab": new Date(2011, 2, 27, 1, 0, 0, 0),
                            "Europe/Moscow": e,
                            "Asia/Amman": new Date(2013, 2, 29, 1, 0, 0, 0),
                            "Asia/Beirut": new Date(2013, 2, 31, 2, 0, 0, 0),
                            "Asia/Damascus": new Date(2013, 3, 6, 2, 0, 0, 0),
                            "Asia/Jerusalem": new Date(2013, 2, 29, 5, 0, 0, 0),
                            "Asia/Yekaterinburg": e,
                            "Asia/Omsk": e,
                            "Asia/Krasnoyarsk": e,
                            "Asia/Irkutsk": e,
                            "Asia/Yakutsk": e,
                            "Asia/Vladivostok": e,
                            "Asia/Baku": new Date(2013, 2, 31, 4, 0, 0),
                            "Asia/Yerevan": new Date(2013, 2, 31, 3, 0, 0),
                            "Asia/Kamchatka": e,
                            "Asia/Gaza": new Date(2010, 2, 27, 4, 0, 0),
                            "Africa/Cairo": new Date(2010, 4, 1, 3, 0, 0),
                            "Europe/Minsk": e,
                            "Pacific/Apia": new Date(2010, 10, 1, 1, 0, 0, 0),
                            "Pacific/Fiji": new Date(2010, 11, 1, 0, 0, 0),
                            "Australia/Perth": new Date(2008, 10, 1, 1, 0, 0, 0)
                        };
                    return n[t]
                };
            return {
                determine: c,
                date_is_dst: r,
                dst_start_for: l
            }
        }();
        e.TimeZone = function(t) {
            "use strict";
            var n = {
                    "America/Denver": ["America/Denver", "America/Mazatlan"],
                    "America/Chicago": ["America/Chicago", "America/Mexico_City"],
                    "America/Santiago": ["America/Santiago", "America/Asuncion", "America/Campo_Grande"],
                    "America/Montevideo": ["America/Montevideo", "America/Sao_Paulo"],
                    "Asia/Beirut": ["Asia/Amman", "Asia/Jerusalem", "Asia/Beirut", "Europe/Helsinki", "Asia/Damascus"],
                    "Pacific/Auckland": ["Pacific/Auckland", "Pacific/Fiji"],
                    "America/Los_Angeles": ["America/Los_Angeles", "America/Santa_Isabel"],
                    "America/New_York": ["America/Havana", "America/New_York"],
                    "America/Halifax": ["America/Goose_Bay", "America/Halifax"],
                    "America/Godthab": ["America/Miquelon", "America/Godthab"],
                    "Asia/Dubai": ["Europe/Moscow"],
                    "Asia/Dhaka": ["Asia/Yekaterinburg"],
                    "Asia/Jakarta": ["Asia/Omsk"],
                    "Asia/Shanghai": ["Asia/Krasnoyarsk", "Australia/Perth"],
                    "Asia/Tokyo": ["Asia/Irkutsk"],
                    "Australia/Brisbane": ["Asia/Yakutsk"],
                    "Pacific/Noumea": ["Asia/Vladivostok"],
                    "Pacific/Tarawa": ["Asia/Kamchatka", "Pacific/Fiji"],
                    "Pacific/Tongatapu": ["Pacific/Apia"],
                    "Asia/Baghdad": ["Europe/Minsk"],
                    "Asia/Baku": ["Asia/Yerevan", "Asia/Baku"],
                    "Africa/Johannesburg": ["Asia/Gaza", "Africa/Cairo"]
                },
                i = t,
                s = function() {
                    for (var t = n[i], s = t.length, a = 0, r = t[0]; s > a; a += 1)
                        if (r = t[a], e.date_is_dst(e.dst_start_for(r))) return void(i = r)
                },
                a = function() {
                    return "undefined" != typeof n[i]
                };
            return a() && s(), {
                name: function() {
                    return i
                }
            }
        }, e.olson = {}, e.olson.timezones = {
            "-720,0": "Pacific/Majuro",
            "-660,0": "Pacific/Pago_Pago",
            "-600,1": "America/Adak",
            "-600,0": "Pacific/Honolulu",
            "-570,0": "Pacific/Marquesas",
            "-540,0": "Pacific/Gambier",
            "-540,1": "America/Anchorage",
            "-480,1": "America/Los_Angeles",
            "-480,0": "Pacific/Pitcairn",
            "-420,0": "America/Phoenix",
            "-420,1": "America/Denver",
            "-360,0": "America/Guatemala",
            "-360,1": "America/Chicago",
            "-360,1,s": "Pacific/Easter",
            "-300,0": "America/Bogota",
            "-300,1": "America/New_York",
            "-270,0": "America/Caracas",
            "-240,1": "America/Halifax",
            "-240,0": "America/Santo_Domingo",
            "-240,1,s": "America/Santiago",
            "-210,1": "America/St_Johns",
            "-180,1": "America/Godthab",
            "-180,0": "America/Argentina/Buenos_Aires",
            "-180,1,s": "America/Montevideo",
            "-120,0": "America/Noronha",
            "-120,1": "America/Noronha",
            "-60,1": "Atlantic/Azores",
            "-60,0": "Atlantic/Cape_Verde",
            "0,0": "UTC",
            "0,1": "Europe/London",
            "60,1": "Europe/Berlin",
            "60,0": "Africa/Lagos",
            "60,1,s": "Africa/Windhoek",
            "120,1": "Asia/Beirut",
            "120,0": "Africa/Johannesburg",
            "180,0": "Asia/Baghdad",
            "180,1": "Europe/Moscow",
            "210,1": "Asia/Tehran",
            "240,0": "Asia/Dubai",
            "240,1": "Asia/Baku",
            "270,0": "Asia/Kabul",
            "300,1": "Asia/Yekaterinburg",
            "300,0": "Asia/Karachi",
            "330,0": "Asia/Kolkata",
            "345,0": "Asia/Kathmandu",
            "360,0": "Asia/Dhaka",
            "360,1": "Asia/Omsk",
            "390,0": "Asia/Rangoon",
            "420,1": "Asia/Krasnoyarsk",
            "420,0": "Asia/Jakarta",
            "480,0": "Asia/Shanghai",
            "480,1": "Asia/Irkutsk",
            "525,0": "Australia/Eucla",
            "525,1,s": "Australia/Eucla",
            "540,1": "Asia/Yakutsk",
            "540,0": "Asia/Tokyo",
            "570,0": "Australia/Darwin",
            "570,1,s": "Australia/Adelaide",
            "600,0": "Australia/Brisbane",
            "600,1": "Asia/Vladivostok",
            "600,1,s": "Australia/Sydney",
            "630,1,s": "Australia/Lord_Howe",
            "660,1": "Asia/Kamchatka",
            "660,0": "Pacific/Noumea",
            "690,0": "Pacific/Norfolk",
            "720,1,s": "Pacific/Auckland",
            "720,0": "Pacific/Tarawa",
            "765,1,s": "Pacific/Chatham",
            "780,0": "Pacific/Tongatapu",
            "780,1,s": "Pacific/Apia",
            "840,0": "Pacific/Kiritimati"
        }, "undefined" != typeof exports ? exports.jstz = e : t.jstz = e
    }(this),
    function() {
        var t, e;
        e = jstz.determine().name(), "https:" === location.protocol && (t = "secure"), document.cookie = "tz=" + encodeURIComponent(e) + "; path=/; " + t
    }.call(this),
    function() {
        var t, e, n;
        GitHub.performanceEnabled() && (n = new TryStorage(sessionStorage), e = function() {
            return window.performance.timing ? void 0 : n.setItem("navigationStart", Date.now())
        }, t = function() {
            return setTimeout(function() {
                var t, e, i, s, a, r, o, c, l, u;
                if (r = {}, r.crossBrowserLoadEvent = Date.now(), window.performance.timing) {
                    c = window.performance.timing;
                    for (e in c) o = c[e], "number" == typeof o && (r[e] = o);
                    (t = null != (l = window.chrome) && "function" == typeof l.loadTimes && null != (u = l.loadTimes()) ? u.firstPaintTime : void 0) && (r.chromeFirstPaintTime = Math.round(1e3 * t))
                } else i = n.getItem("navigationStart"), i && (r.simulatedNavigationStart = parseInt(i, 10));
                return a = function() {
                    var t, e, n, i, a, r;
                    for (a = null != (i = "function" == typeof(t = window.performance).getEntriesByType ? t.getEntriesByType("resource") : void 0) ? i : [], r = [], e = 0, n = a.length; n > e; e++) s = a[e], r.push($.extend({}, s));
                    return r
                }(), Object.keys(r).length > 1 || a.length ? GitHub.stats({
                    timing: r,
                    resources: a
                }) : void 0
            }, 0)
        }, $(window).on("pagehide", e), $(window).on("load", t))
    }.call(this),
    function() {
        $(document).on("click", ".js-toggler-container .js-toggler-target", function(t) {
            return $(t.target).trigger("toggler:toggle"), 0 === $(this).parent(".js-toggler-form").length ? !1 : void 0
        }), $(document).on("ajaxBeforeSend", ".js-toggler-container", function() {
            return this.classList.remove("success", "error"), this.classList.add("loading")
        }), $(document).on("ajaxComplete", ".js-toggler-container", function() {
            return this.classList.remove("loading")
        }), $(document).on("ajaxSuccess", ".js-toggler-container", function() {
            return this.classList.add("success")
        }), $(document).on("ajaxError", ".js-toggler-container", function() {
            return this.classList.add("error")
        }), $(document).on("toggler:toggle", ".js-toggler-container", function() {
            return this.classList.toggle("on")
        })
    }.call(this),
    function() {
        var t, e;
        e = 0, t = function(t) {
            var e;
            if (document.hasFocus()) return e = $(t).closest(".js-timeline-marker").attr("data-mark-as-read-url"), e ? $.ajax({
                url: e,
                type: "post"
            }) : void 0
        }, $.inViewport(".js-unread-item", {
            "in": function() {
                return $(this).removeClass("js-unread-item unread-item")
            }
        }), $.observe(".js-unread-item", {
            add: function() {
                return e++
            },
            remove: function() {
                return e--, 0 === e ? t(this) : void 0
            }
        }), $(document).on("socket:message", ".js-discussion", function(t) {
            return this === t.target ? $(".js-unread-item").removeClass("js-unread-item unread-item") : void 0
        })
    }.call(this),
    function() {
        var t, e, n;
        $.fn.updateContent = function(t) {
            var n;
            return null != (n = this.data("xhr")) && n.abort(), e(this[0], t)
        }, $(document).on("socket:message", ".js-updatable-content", function(e, i, s) {
            var a;
            this === e.target && null == $(this).data("xhr") && (a = t(this, s).then(function(t) {
                return function(e) {
                    return n(t, e)
                }
            }(this)), a["catch"](function(t) {
                return function(e) {
                    return "XMLHttpRequest abort" !== e.message ? console.warn("Failed to update content", t, e) : void 0
                }
            }(this)))
        }), t = function(t, e) {
            var n;
            return null == e && (e = null), n = $(t).ajax({
                channel: e
            }), Promise.resolve(n)["catch"](function(t) {
                throw new Error("XMLHttpRequest " + t.statusText)
            })
        }, e = function(t, e) {
            return $.preserveInteractivePosition(function() {
                return $(t).replaceContent(e)
            })
        }, n = function(t, n) {
            if ($(t).hasInteractions()) throw new Error("element had interactions");
            return e(t, n)
        }
    }.call(this),
    function() {
        $(document).on("upload:complete", ".js-upload-avatar-image", function(t) {
            var e;
            return e = t.upload.result, $.facebox({
                ajax: "/settings/avatars/" + e.id
            })
        })
    }.call(this),
    function() {
        var t, e, n;
        e = function(t) {
            return t.toLowerCase().replace(/[^a-z0-9\-_]+/gi, ".").replace(/\.{2,}/g, ".").replace(/^\.|\.$/gi, "")
        }, n = function(t) {
            return "![Uploading " + t + " . . .]()"
        }, t = function(t) {
            return e(t).replace(/\.[^.]+$/, "").replace(/\./g, " ")
        }, $(document).on("upload:setup", ".js-upload-markdown-image", function(t) {
            var e;
            return e = $(this).find(".js-comment-field"), e.insertText(n(t.upload.file.name) + "\n"), $(this).trigger("validation:change", !1)
        }), $(document).on("upload:complete", ".js-upload-markdown-image", function(e) {
            var i, s, a;
            return i = $(this).find(".js-comment-field"), a = n(e.upload.policy.asset.original_name), s = "![" + t(e.upload.policy.asset.name) + "](" + e.upload.policy.asset.href + ")", i.replaceText(a, s), $(this).trigger("validation:field:change")
        }), $(document).on("upload:error", ".js-upload-markdown-image", function(t) {
            var e, i;
            return e = $(this).find(".js-comment-field"), i = n(t.upload.policy.asset.original_name), e.replaceText(i, ""), $(this).trigger("validation:field:change")
        }), $(document).on("upload:invalid", ".js-upload-markdown-image", function(t) {
            var e, i;
            return e = $(this).find(".js-comment-field"), i = n(t.upload.file.name), e.replaceText(i, ""), $(this).trigger("validation:field:change")
        })
    }.call(this),
    function() {
        $(document).on("upload:complete", ".js-upload-oauth-logo", function(t) {
            var e;
            return e = $(this).find(".js-image-field"), e.attr("src", t.upload.policy.asset.href), $(this).find("input.js-oauth-application-logo-id").val(t.upload.policy.asset.id), $(this).addClass("has-uploaded-logo")
        })
    }.call(this),
    function() {
        var t;
        t = [], $(document).on("upload:setup", ".js-upload-release-file", function(e) {
            var n;
            if (!$("#release_id").val()) return e.preventDefault(), t.length > 0 ? t.push(e.upload.ready) : (t.push(e.upload.ready), n = function() {
                var e, n;
                for (n = []; e = t.pop();) n.push(e());
                return n
            }, $("button.js-save-draft").trigger("click", n))
        }), $(document).on("upload:start", ".js-upload-release-file", function() {
            var t;
            return t = $(this).find(".js-upload-meter"), t.show()
        }), $(document).on("upload:complete", ".js-upload-release-file", function(t) {
            var e, n, i, s;
            return e = $(this).siblings("ul.js-releases-field"), i = e.find("li.js-template").clone(), i.removeClass("template"), i.removeClass("js-template"), n = t.upload.policy.asset.name || t.upload.policy.asset.href.split("/").pop(), i.find(".filename").val(n), t.upload.policy.asset.size ? (s = (t.upload.policy.asset.size / 1048576).toFixed(2), i.find(".filesize").text("(" + s + "MB)")) : i.find(".filesize").text(""), i.find("input[type=hidden].url").val(t.upload.policy.asset.href), i.find("input[type=hidden].id").val(t.upload.policy.asset.id), e.append(i), e.removeClass("not-populated"), e.addClass("is-populated"), $(this).find(".js-upload-meter").hide()
        }), $(document).on("upload:progress", ".js-upload-release-file", function(t) {
            var e;
            return e = $(this).find(".js-upload-meter"), e.css("width", t.upload.percent + "%")
        })
    }.call(this),
    function() {
        var t, e, n, i, s, a, r, o, c, l, u, d, h, f, m, p, g, v, j, b, y, w, x, k, C, S = [].indexOf || function(t) {
            for (var e = 0, n = this.length; n > e; e++)
                if (e in this && this[e] === t) return e;
            return -1
        };
        t = function() {
            function t() {
                this.uploads = [], this.busy = !1
            }
            return t.prototype.upload = function(t, e) {
                var n, i, s, a;
                return a = e.start || function() {}, s = e.progress || function() {}, n = e.complete || function() {}, i = e.error || function() {}, this.uploads.push({
                    file: t,
                    to: e.to,
                    form: e.form || {},
                    header: e.header || {},
                    start: a,
                    progress: s,
                    complete: n,
                    error: i
                }), this.process()
            }, t.prototype.process = function() {
                var t, e, n, i, s, a, r;
                if (!this.busy && 0 !== this.uploads.length) {
                    n = this.uploads.shift(), this.busy = !0, s = new XMLHttpRequest, s.open("POST", n.to, !0), s.setRequestHeader("X-CSRF-Token", this.token()), a = n.header;
                    for (e in a) i = a[e], s.setRequestHeader(e, i);
                    s.onloadstart = function() {
                        return n.start()
                    }, s.onreadystatechange = function(t) {
                        return function() {
                            var e;
                            return 4 === s.readyState ? (204 === s.status ? (e = s.getResponseHeader("Location"), n.complete({
                                href: e
                            })) : 201 === s.status ? n.complete(JSON.parse(s.responseText)) : n.error(s), t.busy = !1, t.process()) : void 0
                        }
                    }(this), s.onerror = function() {
                        return n.error(s)
                    }, s.upload.onprogress = function(t) {
                        var e;
                        return t.lengthComputable ? (e = Math.round(t.loaded / t.total * 100), n.progress(e)) : void 0
                    }, t = new FormData, r = n.form;
                    for (e in r) i = r[e], t.append(e, i);
                    return t.append("file", n.file), s.send(t)
                }
            }, t.prototype.token = function() {
                return $('meta[name="csrf-token"]').attr("content")
            }, t
        }(), j = ["is-default", "is-uploading", "is-bad-file", "is-too-big", "is-failed", "is-bad-dimensions", "is-empty"], y = function(t, e) {
            return $(t).removeClass(j.join(" ")), $(t).addClass(e)
        }, C = new t, b = function(t, e) {
            var n, i;
            return e = $(e), i = function() {
                var n, i, s;
                return s = a(t, e.attr("data-upload-policy-url")), n = function(n) {
                    var i;
                    return e.fire("upload:start", {
                        upload: {
                            file: t
                        }
                    }), i = r(n, e), C.upload(t, i)
                }, i = function(n) {
                    var i;
                    return e.fire("upload:invalid", {
                        upload: {
                            file: t
                        }
                    }), i = v(n, {
                        size: t.size
                    }), y(e, i)
                }, s.then(n, i)
            }, n = $.Event("upload:setup"), e.fire(n, {
                upload: {
                    file: t,
                    ready: i
                }
            }), n.isDefaultPrevented() ? void 0 : i()
        }, a = function(t, e) {
            return $.ajax({
                type: "POST",
                url: e,
                data: {
                    name: t.name,
                    size: t.size,
                    content_type: t.type,
                    organization_id: $("#alambic_organization").data("id"),
                    repository_id: $("#release_repository_id").val(),
                    release_id: $("#release_id").val(),
                    team_id: $("[data-team-id]").data("team-id")
                }
            })
        }, v = function(t, e) {
            var n, i, s, a, r, o, c;
            if (a = "is-failed", 400 === t.status) return "is-bad-file";
            if (422 !== t.status) return a;
            if (i = JSON.parse(t.responseText), null != (null != i ? i.errors : void 0))
                for (c = i.errors, r = 0, o = c.length; o > r; r++) switch (n = c[r], n.field) {
                    case "size":
                        return s = null != e ? e.size : void 0, null != s && 0 === parseInt(s) ? "is-empty" : "is-too-big";
                    case "width":
                    case "height":
                        return "is-bad-dimensions";
                    case "content_type":
                    case "name":
                        return "is-bad-file"
                }
            return a
        }, r = function(t, e) {
            var n;
            return e = $(e), n = {
                to: t.upload_url,
                form: t.form,
                header: t.header,
                start: function() {
                    return y(e, "is-uploading")
                },
                progress: function(t) {
                    return e.fire("upload:progress", {
                        upload: {
                            percent: t
                        }
                    })
                },
                complete: function(n) {
                    var i;
                    return (null != (i = t.asset_upload_url) ? i.length : void 0) > 0 && $.ajax({
                        type: "PUT",
                        url: t.asset_upload_url
                    }), e.fire("upload:complete", {
                        upload: {
                            policy: t,
                            result: n
                        }
                    }), y(e, "is-default")
                },
                error: function(n) {
                    var i;
                    return e.fire("upload:error", {
                        upload: {
                            policy: t
                        }
                    }), i = v(n), y(e, i)
                }
            }
        }, w = function(t) {
            return t.types ? S.call(t.types, "Files") >= 0 : !1
        }, x = function(t) {
            return t.types ? S.call(t.types, "text/uri-list") >= 0 : !1
        }, k = function(t) {
            return t.types ? S.call(t.types, "text/plain") >= 0 : !1
        }, e = function(t, e) {
            var n, i, s, a;
            for (a = [], i = 0, s = t.length; s > i; i++) n = t[i], a.push(b(n, e));
            return a
        }, n = function(t, e) {
            var n, i, s, a, r, o, c;
            if (t) {
                for (n = $(e).find(".js-comment-field"), o = t.split("\r\n"), c = [], a = 0, r = o.length; r > a; a++) i = o[a], s = l(i) ? "\n![](" + i + ")\n" : i, c.push(n.insertText(s));
                return c
            }
        }, i = function(t, e) {
            var n;
            return n = $(e).find(".js-comment-field"), n.insertText(t)
        }, l = function(t) {
            var e;
            return e = t.split(".").pop(), "gif" === e || "png" === e || "jpg" === e || "jpeg" === e
        }, o = function(t) {
            return w(t) ? "copy" : x(t) ? "link" : k(t) ? "copy" : "none"
        }, c = function(t) {
            switch (t) {
                case "image/gif":
                    return "image.gif";
                case "image/png":
                    return "image.png";
                case "image/jpeg":
                    return "image.jpg"
            }
        }, h = function(t) {
            return t.preventDefault()
        }, d = function(t) {
            return t.dataTransfer.dropEffect = "none", t.preventDefault()
        }, f = function(t) {
            var e;
            return e = o(t.dataTransfer), t.dataTransfer.dropEffect = e, $(this).addClass("dragover"), t.stopPropagation(), t.preventDefault()
        }, m = function(t) {
            return t.dataTransfer.dropEffect = "none", $(this).removeClass("dragover"), t.stopPropagation(), t.preventDefault()
        }, p = function(t) {
            var s;
            return $(this).removeClass("dragover"), s = t.dataTransfer, s.types ? w(s) ? e(s.files, this) : x(s) ? n(s.getData("text/uri-list"), this) : k(s) && i(s.getData("text/plain"), this) : y(this, "is-bad-browser"), t.stopPropagation(), t.preventDefault()
        }, g = function(t) {
            var n, i, s, a, r, o, l;
            if (null != (null != (o = t.clipboardData) ? o.items : void 0)) {
                for (l = t.clipboardData.items, a = 0, r = l.length; r > a && (s = l[a], !(i = c(s.type))); a++);
                if (i) return n = s.getAsFile(), n.name = i, e([n], this), t.preventDefault()
            }
        }, u = function(t) {
            return t.target.classList.contains("js-manual-file-chooser") ? (t.target.files ? e(t.target.files, this) : y(this, "is-bad-browser"), t.target.value = "") : void 0
        }, s = 0, $.observe(".js-uploadable-container", {
            add: function() {
                return 0 === s++ && (document.addEventListener("drop", h), document.addEventListener("dragover", d)), this.addEventListener("dragenter", f), this.addEventListener("dragover", f), this.addEventListener("dragleave", m), this.addEventListener("drop", p), this.addEventListener("paste", g), this.addEventListener("change", u)
            },
            remove: function() {
                return 0 === --s && (document.removeEventListener("drop", h), document.removeEventListener("dragover", d)), this.removeEventListener("dragenter", f), this.removeEventListener("dragover", f), this.removeEventListener("dragleave", m), this.removeEventListener("drop", p), this.removeEventListener("paste", g), this.removeEventListener("change", u)
            }
        }), ("undefined" == typeof FormData || null === FormData) && $(document.documentElement).addClass("no-dnd-uploads")
    }.call(this),
    function() {
        var t, e, n, i, s;
        n = function(i) {
            var s, a, r, o, c;
            if (null != i.checkValidity) return i.checkValidity();
            if (s = $(i), s.is("[required]") && !e(i)) return !1;
            if (s.is("[pattern]") && !t(i)) return !1;
            if (s.is("form"))
                for (c = i.elements, r = 0, o = c.length; o > r; r++)
                    if (a = c[r], !n(a)) return !1;
            return !0
        }, e = function(t) {
            return !!t.value.trim()
        }, t = function(t) {
            var e;
            return e = new RegExp("^(?:" + $(t).attr("pattern") + ")$"), 0 === t.value.search(e)
        }, i = function() {
            var t;
            return t = n(this), t && $(this).trigger("validation:field:change"),
                function() {
                    var e;
                    e = n(this), e !== t && $(this).trigger("validation:field:change"), t = e
                }
        }, s = ["input[pattern]", "input[required]", "textarea[required]"].join(","), $(document).onFocusedInput(s, i), $(document).on("change", s, i), $.observe(s, function() {
            $(this).trigger("validation:field:change")
        }), $(document).on("validation:field:change", "form", function() {
            var t;
            return t = n(this), $(this).trigger("validation:change", [t])
        }), $(document).on("validation:change", "form", function(t, e) {
            return $(this).find("button[data-disable-invalid]").prop("disabled", !e)
        }), $(document).on("submit", ".js-normalize-submit", function(t) {
            return n(this) ? void 0 : t.preventDefault()
        })
    }.call(this),
    function() {
        var t;
        $.observe(".will-transition-once", {
            add: function() {
                this.addEventListener("transitionend", t)
            },
            remove: function() {
                this.removeEventListener("transitionend", t)
            }
        }), t = function(t) {
            return t.target.classList.remove("will-transition-once")
        }
    }.call(this),
    function() {
        $(document).on("ajaxSuccess", function(t, e) {
            var n;
            (n = e.getResponseHeader("X-XHR-Location")) && (document.location.href = n, t.stopImmediatePropagation())
        })
    }.call(this),
    function() {
        $(function() {
            var t, e;
            if (t = $("meta[name=octolytics-script-host]")[0]) return null == window._octo && (window._octo = []), _octo.push(["enablePerformance"]), _octo.push(["recordPageView"]), e = document.createElement("script"), e.type = "text/javascript", e.async = !0, e.src = "//" + t.content + "/assets/api.js", document.getElementsByTagName("head")[0].appendChild(e)
        }), $(document).on("pjax:complete", function() {
            return "undefined" != typeof _octo && null !== _octo ? _octo.push(["recordPageView"]) : void 0
        })
    }.call(this),
    function() {
        var t, e;
        e = null, $.conduit = function(t) {
            var n;
            return n = $.Deferred(), (null != e ? e : e = $("link[rel=conduit-xhr]").prop("href")) ? $.ajax({
                url: "" + e + t,
                success: function(t) {
                    return n.resolve(t)
                },
                error: function() {
                    return n.reject()
                }
            }) : n.reject(), n.promise()
        }, t = null, $.conduit.status = function() {
            return null != t ? t : t = $.conduit("status")
        }, $.conduit.capable = function(t) {
            return $.conduit.status().then(function(e) {
                var n;
                return n = $.Deferred(), -1 !== e.capabilities.indexOf(t) ? n.resolve() : n.reject()
            })
        }
    }.call(this),
    function() {
        var t;
        $.observe(".js-conduit-openfile-check", t = function(t) {
            $.conduit.capable("url-parameter-filepath").done(function() {
                return $(t).attr("href", $(t).attr("data-url"))
            }).fail(function() {
                return $(t).addClass("disabled").attr("aria-label", $(t).attr("data-failed-title"))
            })
        })
    }.call(this),
    function() {
        var t;
        $.observe(".js-conduit-rewrite-url", t = function(t) {
            $.conduit.status().done(function() {
                return t.href = t.getAttribute("data-url")
            })
        })
    }.call(this),
    function() {
        var t, e, n, i, s, a, r, o, c, l, u, d, h, f, m;
        r = null, o = null, h = null, f = null, $(document).on("pjax:send pjax:complete", ".js-contribution-activity", function(t) {
            var e;
            e = "pjax:send" === t.type, this.classList.toggle("loading", e)
        }), $(document).on("graph:load", ".js-calendar-graph", function(t, e) {
            $(this).append(e), n(this)
        }), $.observe(".js-calendar-graph", function() {
            var t;
            t = this.querySelector(".js-calendar-graph-svg"), t && n(this)
        }), $(document).on("click", ".js-calendar-graph rect.day", function(t) {
            var e;
            e = new Date(this.getAttribute("data-date")), c(e, t.shiftKey, !1)
        }), $(document).on("mouseover", ".js-calendar-graph rect.day", function() {
            m(this)
        }), $(document).on("mouseout", ".js-calendar-graph rect.day", function() {
            $(".svg-tip").remove()
        }), n = function(t) {
            var e, n;
            return e = t.getAttribute("data-from"), e && (e = o = new Date(e)), n = t.getAttribute("data-to"), n && (n = new Date(n)), e || n ? c(e, n, !0) : void 0
        }, t = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], m = function(e) {
            var n, i, s, a, r, o, c, l;
            return s = new Date(e.getAttribute("data-date")), i = parseInt(e.getAttribute("data-count")), o = 0 === i ? "No" : i, r = t[s.getUTCMonth()].slice(0, 3) + " " + s.getUTCDate() + ", " + s.getUTCFullYear(), a = $('<div class="svg-tip svg-tip-one-line n">\n  <strong>' + o + " " + $.pluralize(i, "contribution") + "</strong> on " + r + "\n</div>").get(0), $(".svg-tip").remove(), document.body.appendChild(a), n = e.getBoundingClientRect(), c = n.left + window.pageXOffset - a.offsetWidth / 2 + n.width / 2, l = n.bottom + window.pageYOffset - a.offsetHeight - 2 * n.height, a.style.top = "" + l + "px", a.style.left = "" + c + "px"
        }, s = function(t) {
            return $.pjax({
                url: t,
                container: ".js-contribution-activity",
                scrollTo: !1,
                replace: !0
            })
        }, u = function(t) {
            var e, n;
            return r = t, e = null, h = null, f = null, n = "" + document.location.pathname + "?tab=contributions&period=" + r, d(), s(n)
        }, l = function(t, e) {
            var n, i;
            return i = t.getAttribute("class").trim().split(" "), i = function() {
                var t, s, a;
                for (a = [], t = 0, s = i.length; s > t; t++) n = i[t], n !== e && a.push(n);
                return a
            }(), t.setAttribute("class", i.join(" "))
        }, e = function(t, e) {
            var n;
            return n = t.getAttribute("class") + " " + e, t.setAttribute("class", n.trim())
        }, d = function(t, n) {
            var i, s, a, r, o, c, u, d, h;
            for (i = document.querySelector(".js-calendar-graph"), r = i.querySelectorAll("rect.day"), o = 0, u = r.length; u > o; o++) s = r[o], l(s, "active");
            if (i.classList.remove("days-selected"), t || n) {
                for (i.classList.add("days-selected"), a = function(e) {
                        var i;
                        return i = new Date(e.getAttribute("data-date")).getTime(), t && n ? t.getTime() <= i && i <= n.getTime() : i === t.getTime()
                    }, h = [], c = 0, d = r.length; d > c; c++) s = r[c], a(s) && h.push(e(s, "active"));
                return h
            }
        }, a = function(t) {
            return ("0" + t).slice(-2)
        }, i = function(t) {
            return t.getUTCFullYear() + "-" + a(t.getUTCMonth() + 1) + "-" + a(t.getUTCDate())
        }, c = function(t, e, n) {
            var a, c, l, m, p, g, v, $;
            return p = "" + document.location.pathname + "?tab=contributions", t >= h && f >= t ? void u("weekly") : ("object" == typeof e && (o = e, e = !0), o && e ? (l = new Date(o.getTime() - 26784e5), c = new Date(o.getTime() + 26784e5), g = t > o ? [o, t] : [t, o], a = g[0], m = g[1], l > a && (a = l), m > c && (m = c), v = [a, m], h = v[0], f = v[1], p += "&from=" + i(a) + "&to=" + i(m)) : (a = t, $ = [a, null], h = $[0], f = $[1], p += "&from=" + i(a)), o = t, r = "custom", d(a, m), n ? void 0 : s(p))
        }, $(document).on("change", ".js-period-container", function(t) {
            var e;
            return t.preventDefault(), t.stopPropagation(), e = $(t.target).val().toLowerCase(), r !== e ? u(e) : void 0
        })
    }.call(this),
    function() {
        var t, e;
        $(document).on("submit", ".js-find-coupon-form", function(t) {
            var e, n;
            return e = t.target.action, n = $("#code").val(), window.location = e + "/" + encodeURIComponent(n), t.stopPropagation(), t.preventDefault()
        }), $(document).on("click", ".js-choose-account", function(e) {
            return $(".js-plan-row, .js-choose-plan").removeClass("selected"), $(".js-plan").val(""), $(".js-billing-section").addClass("has-removed-contents"), t($(this).closest(".js-account-row")), e.stopPropagation(), e.preventDefault()
        }), $(document).on("click", ".js-choose-plan", function(t) {
            return e($(this).closest(".js-plan-row")), t.stopPropagation(), t.preventDefault()
        }), $.observe(".js-plan-row.selected:not(.free-plan)", {
            add: function() {
                return $(this).closest("form").find(".js-redeem-button").prop("disabled", !1)
            },
            remove: function() {
                return $(this).closest("form").find(".js-redeem-button").prop("disabled", !0)
            }
        }), t = function(t) {
            var n, i, s, a;
            if (t.length) return s = t.data("login"), a = t.data("plan"), $(".js-account-row, .js-choose-account").removeClass("selected"), t.addClass("selected"), t.find(".js-choose-account").addClass("selected"), $(".js-account").val(s), $(".js-plan-section").removeClass("is-hidden"), $(".js-billing-plans").addClass("is-hidden"), i = $(".js-plans-for-" + s), i.removeClass("is-hidden"), n = $(".js-plan-row", i), e(1 === n.length ? n : $("[data-name='" + a + "']", i))
        }, e = function(t) {
            var e, n, i, s, a;
            if (t.length) return s = t.data("name"), n = parseInt(t.data("cost"), 10), a = t.closest(".js-billing-plans"), i = a.data("has-billing"), e = a.data("login"), $(".js-plan-row, .js-choose-plan").removeClass("selected"), t.addClass("selected"), t.find(".js-choose-plan").addClass("selected"), $(".js-plan").val(s), 0 === n || i ? $(".js-billing-section").addClass("has-removed-contents") : $(".js-billing-section[data-login='" + e + "']").removeClass("has-removed-contents")
        }, $(function() {
            return t($(".coupons .js-account-row.selected")), e($(".coupons .js-plan-row.selected"))
        })
    }.call(this),
    function() {
        var t, e, n, i, s, a;
        GitHub.performanceEnabled() && (n = new WeakMap, e = 0, t = function(t) {
            var i, s;
            return i = e++, s = t.target.getAttribute("data-url"), n[t.target] = {
                id: i,
                path: s
            }, window.performance.mark("dc_render_start_" + i)
        }, i = function(t, e) {
            var i, s, a, r, o, c, l, u, d, h;
            n[t.target] && (d = n[t.target], a = d.id, c = d.path, u = new URL(c, window.location).href, s = "dc_" + e + "_end_" + a, o = "dc_" + e + "_" + a, window.performance.mark(s), window.performance.measure(o, "dc_render_start_" + a, s), r = window.performance.getEntriesByName(o), i = null != (h = r.pop()) ? h.duration : void 0, null != i && (l = {}, l["deferred_content_" + e] = {
                url: u,
                ms: i
            }, GitHub.stats(l)))
        }, a = function(t) {
            return i(t, "render")
        }, s = function(t) {
            return window.requestAnimationFrame(function() {
                return i(t, "paint")
            })
        }, $(document).on("deferredcontent:load", t), $(document).on("deferredcontent:loaded", a), $(document).on("deferredcontent:loaded", s))
    }.call(this),
    function() {
        var t;
        t = function(t) {
            $(t).find(".js-zeroclipboard-new-repo-commands").attr("data-clipboard-text", $(".js-new-repo-commands").text()), $(t).find(".js-zeroclipboard-existing-repo-commands").attr("data-clipboard-text", $(".js-existing-repo-commands").text())
        }, $.observe(".js-empty-repo-options", t), $(document).on("click", ".js-git-protocol-selector", function() {
            var e, n;
            return e = $(this).closest(".url-box"), n = $(this).attr("href"), e.find(".js-url-field").val(n), e.find(".js-zeroclipboard").attr("data-clipboard-text", n), $(".js-live-clone-url").text(n), t($(".js-empty-repo-options")), (n = $(this).attr("data-url")) && $.ajax({
                type: "POST",
                url: n
            }), e.find(".js-clone-urls > .selected").removeClass("selected"), $(this).parent(".js-clone-url-button").addClass("selected"), !1
        }), $(document).on("click", ".js-clone-selector", function(t) {
            var e, n, i, s;
            return t.preventDefault(), e = $(this).attr("data-protocol"), s = $(".clone-url").hide(), n = s.filter('[data-protocol-type="' + e + '"]').show(), (i = n.attr("data-url")) ? $.ajax({
                type: "POST",
                url: i
            }) : void 0
        })
    }.call(this),
    function() {
        var t, e, n, i, s, a, r;
        window.GoogleAnalyticsObject = "ga", null == window.ga && (window.ga = function() {
                var t;
                return null == (t = window.ga).q && (t.q = []), window.ga.q.push(arguments)
            }), window.ga.l = Date.now(),
            function() {
                var t;
                if (t = $("meta[name=google-analytics]")[0]) return window.ga("create", t.content, "github.com")
            }(), s = function() {
                var t, e;
                return t = window.ga, e = window.location.pathname + window.location.search, $(document.body).hasClass("logged_in") ? t("send", "pageview", e, {
                    dimension1: "Logged In"
                }) : t("send", "pageview", e, {
                    dimension2: "Logged Out"
                })
            }, i = function(t) {
                var e, n, i, s, a;
                a = t.trim().split(/\s*,\s*/), n = a[0], e = a[1], i = a[2], s = a[3], window.ga("send", "event", n, e, i, s, {
                    useBeacon: !0
                })
            }, e = function(t) {
                var e;
                e = $(t.target).closest("[data-ga-click]").attr("data-ga-click"), e && i(e)
            }, r = new WeakMap, n = function() {
                var t, e, n, s;
                for (e = $("[data-ga-load]"), n = 0, s = e.length; s > n; n++) t = e[n], r.get(t) || (r.set(t, !0), i(t.getAttribute("data-ga-load")))
            }, a = function() {
                var t, e, n, s, a;
                for (e = $("meta[name=analytics-event]"), a = [], n = 0, s = e.length; s > n; n++) t = e[n], r.get(t) || (r.set(t, !0), a.push(i(t.content)));
                return a
            }, t = function() {
                return s(), a(), n()
            }, window.addEventListener("click", e, !0), $(t), $(document).on("pjax:complete", function() {
                return setTimeout(t, 20)
            })
    }.call(this),
    function() {
        $(document).on("submit", ".js-user-recommendations-form", function() {
            var t;
            return t = $(".js-user-interests-input").val(), window.ga("send", "event", "Recommendations", "submit", "Interest entered : " + t)
        }), $(document).on("click", ".js-interest-option", function() {
            var t;
            return t = $(this).text(), window.ga("send", "event", "Recommendations", "click", "Example Interest clicked : " + t)
        }), $(document).on("click", ".js-user-interests-item-close", function() {
            var t;
            return t = $(this).parent(".js-user-interests-item").attr("title"), window.ga("send", "event", "Recommendations", "click", "Interest removed : " + t)
        }), $(document).on("submit", ".recommendations-wrapper .js-unfollow-button", function() {
            return window.ga("send", "event", "Recommendations", "submit", "Unfollowed a User suggestion")
        }), $(document).on("submit", ".recommendations-wrapper .js-follow-button", function() {
            return window.ga("send", "event", "Recommendations", "submit", "Followed a User suggestion")
        }), $(document).on("submit", ".recommendations-wrapper .js-unstar-button", function() {
            return window.ga("send", "event", "Recommendations", "submit", "Unstarred a Repo suggestion")
        }), $(document).on("submit", ".recommendations-wrapper .js-star-button", function() {
            return window.ga("send", "event", "Recommendations", "submit", "Starred a Repo suggestion")
        })
    }.call(this),
    function() {
        $(function() {
            return $(".js-form-signup-home").one("input", "input[type=text]", function() {
                return window.ga("send", "event", "Signup", "Attempt", "Homepage Form")
            }), $(".js-form-signup-detail").one("input", "input[type=text]", function() {
                return window.ga("send", "event", "Signup", "Attempt", "Detail Form")
            })
        })
    }.call(this),
    function() {
        var t, e, n, i, s, a, r, o, c, l, u, d, h, f, m = [].slice;
        n = {
            originalHistoryState: JSON.stringify(window.history.state)
        }, e = [], c = (new Date).getTime(), h = new TryStorage(sessionStorage), f = !1, r = function() {
            f = !0
        }, a = function() {
            f = !1
        }, $(window).on("pageshow", a), $(window).on("pagehide", r), $(window).on("error", function(t) {
            var i, a, r, l, d, h;
            h = t.originalEvent, d = h.message, r = h.filename, l = h.lineno, a = h.error, i = $.extend.apply($, [{}, n].concat(m.call(e), [{
                message: d,
                filename: r,
                lineno: l,
                url: window.location.href,
                readyState: document.readyState,
                referrer: document.referrer,
                stack: null != a ? a.stack : void 0,
                historyState: JSON.stringify(window.history.state),
                timeSinceLoad: Math.round((new Date).getTime() - c),
                extensionScripts: JSON.stringify(s().sort()),
                navigations: JSON.stringify(o())
            }], [null != a ? a.failbotContext : void 0])), e = [], null != i.eventTarget && (i.eventTarget = $(i.eventTarget).inspect()), $(document).trigger("captured:error", i), u(t) && $.ajax({
                type: "POST",
                url: "/_errors",
                data: {
                    error: i
                }
            })
        }), u = function() {
            var t;
            return t = 0,
                function(e) {
                    var n, i, s;
                    return s = e.originalEvent, i = s.lineno, n = s.error, null != (null != n ? n.stack : void 0) && i ? f ? !1 : t >= 10 ? !1 : (t++, !0) : !1
                }
        }(), s = function() {
            var t, e, n, i, s;
            for (i = $("script"), s = [], e = 0, n = i.length; n > e; e++) t = i[e], /^(?:chrome-extension|file):/.test(t.src) && s.push(t.src);
            return s
        }, i = jQuery.event.dispatch, jQuery.event.dispatch = function(t) {
            var n;
            return "error" === t.type && t.target === window ? i.apply(this, arguments) : (e.push({
                eventType: t.type,
                eventTarget: t.target
            }), n = i.apply(this, arguments), e.pop(), n)
        }, l = function(t, e) {
            var n;
            return n = o(), n.push({
                type: t,
                url: window.location.href,
                state: window.history.state,
                info: e
            }), d(n)
        }, t = "navigations", o = function() {
            var e;
            return e = h.getItem(t), e ? JSON.parse(e) : []
        }, d = function(e) {
            return h.setItem(t, JSON.stringify(e))
        }, l("load"), $(window).on("hashchange", function(t) {
            return l("hashchange", {
                oldURL: t.oldURL,
                newURL: t.newURL
            })
        }), $(window).on("popstate", function(t) {
            return l("popstate", {
                eventState: t.state
            })
        }), $(document).on("pjax:success", function() {
            return l("pjax:success")
        }), $(document).on("pjax:popstate", function(t) {
            return l("pjax:popstate", {
                pjaxDirection: t.direction,
                pjaxState: t.state
            })
        }), "#b00m" === window.location.hash && b00m()
    }.call(this),
    function() {
        $(document).on("click", ".email-hidden-toggle > a", function() {
            return $(this).parent().siblings(".email-hidden-reply").toggle(), !1
        })
    }.call(this),
    function() {
        var t;
        t = function() {
            var t, e, n, i, s, a, r, o, c, l, u;
            n = $(this), c = n.attr("data-url"), r = n.attr("data-search-url"), s = {
                top: 5,
                right: 0,
                bottom: 15,
                left: 0
            }, u = n.width() - s.left - s.right, i = n.height() - s.top - s.bottom, e = d3.time.format("%Y-%m-%d"), o = d3.tip().attr("class", "svg-tip").offset([-10, 0]).html(function(t) {
                return "<strong>" + t.count + "</strong> " + $.pluralize(t.count, "event")
            }), l = d3.select(n.get(0)).append("svg").attr("width", u + s.left + s.right).attr("height", i + s.top + s.bottom).attr("class", "vis").append("g").attr("transform", "translate(" + s.left + ", " + s.top + ")").call(o), a = function() {
                l.remove(), $(".js-auth-info").remove(), n.append("div").attr("class", "inline-error").text("We couldn't render audit log activity for some reason. Try refreshing the page.")
            }, t = function(t) {
                var e;
                return e = {}, t.forEach(function(t) {
                    var n, i;
                    return t.date = n = new Date(1e3 * t.time), i = n.toDateString(), e.hasOwnProperty(i) ? e[i].count += t.count : e[i] = t
                }), d3.map(e).values()
            }, d3.json(c, function(n, s) {
                var c, d, h, f, m;
                return null != n ? a() : (s = t(s), d = d3.max(s, function(t) {
                    return t.count
                }), h = d3.sum(s, function(t) {
                    return t.count
                }), f = d3.scale.ordinal().domain(d3.range(s.length)).rangeRoundBands([0, u], .1), m = d3.scale.linear().domain([0, d]).range([i, 0]), c = l.selectAll(".audit-day").data(s).enter().append("g").attr("class", "audit-day").attr("transform", function(t, e) {
                    return "translate(" + f(e) + ", 0)"
                }), c.append("rect").attr("width", f.rangeBand()).attr("height", 1).attr("y", i - 1).attr("class", "bar-base"), c.append("a").attr("xlink:href", function(t) {
                    return "" + r + "?q=created:" + e(t.date)
                }).append("rect").attr("width", f.rangeBand()).attr("height", function(t) {
                    return "" + (i - m(t.count))
                }).attr("y", function(t) {
                    return m(t.count)
                }).on("mouseover", o.show).on("mouseout", o.hide), c.append("text").attr("y", i + 15).attr("x", f.rangeBand() / 2).text(function(t) {
                    return d3.time.format("%a")(t.date).slice(0, 2)
                }), d3.select(".js-auth-info").html("<span class='sum'>" + h + "</span> " + $.pluralize(h, "event") + " happened in the past two weeks."))
            })
        }, d3Ready().then(function() {
            return $.observe(".js-audit-activity", t)
        })
    }.call(this),
    function() {
        $(document).on("click", ".js-new-user-contrib-example", function(t) {
            var e, n, i, s;
            return t.preventDefault(), e = document.querySelector(".js-calendar-graph"), e.classList.contains("sample-graph") ? void 0 : (e.classList.add("sample-graph"), n = function(t) {
                var n;
                return n = e.querySelector(".js-calendar-graph-svg"), $(n).replaceWith(t)
            }, i = function() {
                return e.classList.remove("sample-graph")
            }, s = $.get(this.getAttribute("href")), s.then(n, i))
        })
    }.call(this),
    function() {
        $(document).on("graph:load", ".js-graph-code-frequency", function(t, e) {
            var n, i, s, a, r, o, c, l, u, d, h, f, m, p, g, v, j, b, y;
            return p = $(this).width(), a = 500, y = [10, 10, 20, 40], d = y[0], u = y[1], c = y[2], l = y[3], e = e.map(function(t) {
                return [new Date(1e3 * t[0]), t[1], t[2]]
            }).sort(function(t, e) {
                return d3.ascending(t[0], e[0])
            }), n = e.map(function(t) {
                return [t[0], t[1]]
            }), s = e.map(function(t) {
                return [t[0], t[2]]
            }), r = d3.max(n, function(t) {
                return t[1]
            }), o = d3.min(s, function(t) {
                return t[1]
            }), m = e[0][0], f = e[e.length - 1][0], g = d3.time.scale().domain([m, f]).range([0, p - l - u]), j = d3.scale.linear().domain([o, r]).range([a - c - d, 0]), v = d3.svg.axis().scale(g).tickFormat(function(t) {
                return m.getFullYear() !== f.getFullYear() ? d3.time.format("%m/%y")(t) : d3.time.format("%m/%d")(t)
            }), b = d3.svg.axis().scale(j).orient("left").tickPadding(5).tickSize(p).tickFormat(function(t) {
                return d3.formatSymbol(t, !0)
            }), i = d3.svg.area().x(function(t) {
                return g(t[0])
            }).y0(function(t) {
                return j(t[1])
            }).y1(function() {
                return j(0)
            }), h = d3.select(this).data(e).append("svg").attr("width", p).attr("height", a).attr("class", "viz code-frequency").append("g").attr("transform", "translate(" + l + "," + d + ")"), h.append("g").attr("class", "x axis").attr("transform", "translate(0, " + (a - d - c) + ")").call(v), h.append("g").attr("class", "y axis").attr("transform", "translate(" + p + ", 0)").call(b), h.selectAll("path.area").data([n, s]).enter().append("path").attr("class", function(t, e) {
                return 0 === e ? "addition" : "deletion"
            }).attr("d", i)
        })
    }.call(this),
    function() {
        $(document).on("graph:load", ".js-commit-activity-graph", function(t, e) {
            var n, i, s, a, r, o, c, l, u, d, h, f, m, p, g, v, j, b, y, w, x, k;
            return c = $("#commit-activity-master"), i = $("#commit-activity-detail"), r = 260, v = i.width(), j = 0, p = null,
                function() {
                    var t, n, a, o, c, l, u, d, h, f, m, g, b, y, w, x, k, C, S, T;
                    for (l = 0, c = C = 0, S = e.length; S > C; c = ++C) t = e[c], 0 !== t.total && (l = c);
                    return j = l, T = [20, 30, 30, 40], m = T[0], h = T[1], f = T[2], d = T[3], a = e[j].days, u = d3.max(e, function(t) {
                        return d3.max(t.days)
                    }), y = d3.scale.linear().domain([0, a.length - 1]).range([0, v - h - f]), x = d3.scale.linear().domain([0, u]).range([r, 0]), k = d3.svg.axis().scale(x).orient("left").ticks(5).tickSize(-v + f + h), $(this).on("hotkey:activate", function(t) {
                        var n, i;
                        return i = j, n = t.originalEvent.hotkey, "left" === n || "right" === n ? (j > 0 && "left" === n && (i -= 1), j < e.length && "right" === n && (i += 1), p({
                            index: i
                        })) : void 0
                    }), b = d3.select(i[0]).data([a]).append("svg").attr("width", v).attr("height", r + m + d).attr("class", "viz").append("g").attr("transform", "translate(" + h + "," + m + ")"), b.append("g").attr("class", "y axis").call(k), w = b.append("g").attr("class", "axis"), n = w.selectAll(".day").data(d3.weekdays).enter().append("g").attr("class", "day").attr("transform", function(t, e) {
                        return "translate(" + y(e) + ", " + r + ")"
                    }), n.append("text").attr("text-anchor", "middle").attr("dy", "2em").text(function(t) {
                        return t
                    }), g = d3.svg.line().x(function(t, e) {
                        return y(e)
                    }).y(x), b.append("path").attr("class", "path").attr("d", g), o = b.selectAll("g.dot").data(a).enter().append("g").attr("class", "dot").attr("transform", function(t, e) {
                        return "translate(" + y(e) + ", " + x(t) + ")"
                    }), o.append("circle").attr("r", 4), o.append("text").attr("text-anchor", "middle").attr("class", "tip").attr("dy", -10).text(function(t) {
                        return t
                    }), p = function(t) {
                        var n, i, r;
                        if (!(t.index >= 52 || t.index < 0)) return j = t.index, a = e[t.index].days, u = d3.max(a), y.domain([0, a.length - 1]), r = d3.selectAll(".bar.mini").attr("class", "bar mini"), n = d3.select(r[0][j]).attr("class", "bar mini active"), i = d3.transform(n.attr("transform")), s.transition().ease("back-out").duration(300).attr("transform", "translate(" + (i.translate[0] + 8) + ", 105)"), b.selectAll(".path").data([a]).transition().duration(500).attr("d", g), b.selectAll("g.dot").data(a).transition().duration(300).attr("transform", function(t, e) {
                            return "translate(" + y(e) + ", " + x(t) + ")"
                        }), b.selectAll("text.tip").data(a).text(function(t) {
                            return t
                        })
                    }
                }(), k = [10, 30, 20, 30], h = k[0], u = k[1], d = k[2], l = k[3], r = 100, m = e.map(function(t) {
                    return t.total
                }), o = d3.max(m), a = d3.time.format.utc("%m/%d"), b = d3.scale.ordinal().domain(d3.range(m.length)).rangeRoundBands([0, v - u - d], .1), w = d3.scale.linear().domain([0, o]).range([r, 0]), x = d3.svg.axis().scale(w).orient("left").ticks(3).tickSize(-v + u + d).tickFormat(d3.formatSymbol), y = d3.svg.axis().scale(b).ticks(d3.time.weeks).tickFormat(function(t, n) {
                    var i;
                    return i = new Date(1e3 * e[n].week), a(i)
                }), f = d3.tip().attr("class", "svg-tip").offset([-10, 0]).html(function(t, n) {
                    var i, s;
                    return i = new Date(1e3 * e[n].week), s = "" + d3.months[i.getUTCMonth()].slice(0, 3) + " " + i.getUTCDate(), "<strong>" + t + "</strong> " + $.pluralize(t, "commit") + " the week of " + s
                }), g = d3.select(c[0]).style("width", "" + v + "px").append("svg").attr("width", v + (u + d)).attr("height", r + h + l).attr("class", "viz").append("g").attr("transform", "translate(" + u + "," + h + ")").call(f), g.append("g").attr("class", "y axis").call(x), n = g.selectAll("g.mini").data(m).enter().append("g").attr("class", function(t, e) {
                    return e === j ? "bar mini active" : "bar mini"
                }).attr("transform", function(t, e) {
                    return "translate(" + b(e) + ", 0)"
                }).on("click", function(t, e) {
                    return p({
                        node: this,
                        index: e,
                        data: t
                    })
                }), n.append("rect").attr("width", b.rangeBand()).attr("height", function(t) {
                    return r - w(t)
                }).attr("y", function(t) {
                    return w(t)
                }).on("mouseover", f.show).on("mouseout", f.hide), g.append("g").attr("class", "x axis").attr("transform", "translate(0," + r + ")").call(y).selectAll(".tick").style("display", function(t, e) {
                    return e % 3 !== 0 ? "none" : "block"
                }), s = g.append("circle").attr("class", "focus").attr("r", 8).attr("transform", "translate(" + (b(j) + b.rangeBand() / 2) + ", " + -r + ")"), s.transition().ease("elastic-in").duration(1e3).attr("r", 2).attr("transform", "translate(" + (b(j) + b.rangeBand() / 2) + ", " + (r + 5) + ")")
        })
    }.call(this),
    function() {
        var t, e, n, i;
        n = function() {
            var t, e, n, i, s, a, r, o;
            for (n = {}, r = document.location.search.substr(1).split("&"), s = 0, a = r.length; a > s; s++) e = r[s], o = e.split("="), t = o[0], i = o[1], n[t] = i;
            return n
        }, t = function(t) {
            return t = new Date(t), d3.months[t.getUTCMonth()].slice(0, 3) + " " + t.getUTCDate() + ", " + t.getUTCFullYear()
        }, i = function(e, n) {
            var i, s;
            return s = t(e), i = t(n), $(".js-date-range").html("" + s + " &ndash; " + i)
        }, e = function(t) {
            var e, n;
            return e = t[0].weeks[0].date, n = new Date(e.getTime() - 6048e5), t.forEach(function(t) {
                return t.weeks.unshift({
                    a: 0,
                    c: 0,
                    d: 0,
                    date: n,
                    w: n / 1e3
                })
            })
        }, $(document).on("graph:load", "#contributors", function(t, s) {
            var a, r, o, c, l, u, d, h, f, m, p, g, v, j, b, y, w, x, k;
            return r = $(this), o = [], f = n(), k = null, x = null, null != f.from && (b = new Date(f.from)), null != f.to && (l = new Date(f.to)), c = (null != f ? f.type : void 0) || "c", d = d3.time.format.utc("%Y-%m-%d"), m = function(t) {
                return new Date(1e3 * ~~t)
            }, r.on("range.selection.end", function(t, e) {
                var n;
                return n = e.range, b = n[0], l = n[1], d(b) === d(l) && (b = k, l = x), w(), i(b, l), v()
            }), g = function(t) {
                var n, s;
                return 1 === t[0].weeks.length && e(t), s = a(t), k = m(s[0].key), x = m(~~s[s.length - 1].key + 518400), n = new Date, x > n && (x = new Date(Date.UTC(n.getFullYear(), n.getMonth(), n.getDate()))), null == b && (b = k), null == l && (l = x), i(b, l), j(s, k, x), v(t, k, x), $(".js-contribution-container").on("change", "input[type=radio]", h)
            }, p = function(t) {
                var e, n, i, s, a, r, o;
                for (i = 0, a = t.length; a > i; i++)
                    for (e = t[i], o = e.weeks, s = 0, r = o.length; r > s; s++) n = o[s], n.date = new Date(1e3 * n.w);
                return t
            }, u = function(t, e) {
                return t.map(function(t) {
                    var n;
                    return n = $.extend(!0, {}, t), n.weeks = n.weeks.filter(function(t) {
                        return t.date >= e[0] && t.date <= e[1]
                    }), n
                })
            }, a = function(t) {
                var e, n, i, s, a, r, o, c, l;
                for (n = {}, s = 0, r = t.length; r > s; s++)
                    for (e = t[s], l = e.weeks, a = 0, o = l.length; o > a; a++) i = l[a], null == n[c = i.w] && (n[c] = {
                        c: 0,
                        a: 0,
                        d: 0
                    }), n[i.w].c += i.c, n[i.w].a += i.a, n[i.w].d += i.d;
                return d3.entries(n)
            }, y = function(t) {
                return t = u(t, [b, l]), t.forEach(function(t) {
                    var e, n, i, s, a, r, o;
                    for (n = 0, e = 0, i = 0, o = t.weeks, a = 0, r = o.length; r > a; a++) s = o[a], n += s.c, e += s.a, i += s.d;
                    return t.c = n, t.a = e, t.d = i
                }), t.sort(function(t, e) {
                    return d3.descending(t[c], e[c])
                })
            }, j = function(t, e, n) {
                var i, s, a, o, u, h, f, p, g, v, $, j, y, w, x, k, C, S;
                return S = [20, 50, 20, 30], p = S[0], h = S[1], f = S[2], u = S[3], y = r.width(), a = 125, o = d3.max(t, function(t) {
                    return t.value[c]
                }), w = d3.time.scale().domain([e, n]).range([0, y - h - f]), k = d3.scale.linear().domain([0, o]).range([a, 0]), C = d3.svg.axis().scale(k).orient("left").ticks(4).tickSize(-y + h + f).tickPadding(10).tickFormat(d3.formatSymbol), x = d3.svg.axis().scale(w), t.length < 5 && x.ticks(t.length), i = d3.svg.area().interpolate("basis").x(function(t) {
                    return w(m(t.key))
                }).y0(function() {
                    return a
                }).y1(function(t) {
                    return k(t.value[c])
                }), d3.select("#contributors-master svg").remove(), j = d3.select("#contributors-master").data([t]).append("svg").attr("height", a + p + u).attr("width", y).attr("class", "viz").append("g").attr("transform", "translate(" + h + "," + p + ")"), j.append("g").attr("class", "x axis").attr("transform", "translate(0, " + a + ")").call(x), j.append("g").attr("class", "y axis").call(C), j.append("path").attr("class", "area").attr("d", i), $ = function() {
                    var t;
                    return j.classed("selecting", !0), t = d3.event.target.extent(), r.trigger("range.selection.start", {
                        data: arguments[0],
                        range: t
                    })
                }, g = function() {
                    var t;
                    return t = d3.event.target.extent(), r.trigger("range.selection.selected", {
                        data: arguments[0],
                        range: t
                    })
                }, v = function() {
                    var t;
                    return j.classed("selecting", !d3.event.target.empty()), t = d3.event.target.extent(), r.trigger("range.selection.end", {
                        data: arguments[0],
                        range: t
                    })
                }, s = d3.svg.brush().x(w).on("brushstart", $).on("brush", g).on("brushend", v), (d(b) !== d(e) || d(l) !== d(n)) && s.extent([b, l]), j.append("g").attr("class", "selection").call(s).selectAll("rect").attr("height", a)
            }, v = function() {
                var t, e, n, i, a, r, u, d, h, f, m, p, g, v, j, w, x, k, C, S, T, L;
                return L = [10, 10, 10, 20], h = L[0], u = L[1], d = L[2], r = L[3], w = 428, n = 100, $("#contributors ol").remove(), s = y(o), p = document.createElement("ol"), j = d3.select(p).attr("class", "contrib-data capped-cards clearfix"), a = d3.max(s, function(t) {
                    return d3.max(t.weeks, function(t) {
                        return t[c]
                    })
                }), x = d3.time.scale().domain([b, l]).range([0, w]), C = d3.scale.linear().domain([0, a]).range([n - r - h, 0]), e = d3.svg.area().interpolate("basis").x(function(t) {
                    return x(t.date)
                }).y0(function() {
                    return n - r - h
                }).y1(function(t) {
                    return C(t[c])
                }), S = d3.svg.axis().scale(C).orient("left").ticks(2).tickSize(-w).tickPadding(10).tickFormat(d3.formatSymbol), g = d3.time.format("%m/%y"), k = d3.svg.axis().scale(x).tickFormat(g), s[0].weeks.length < 5 && k.ticks(s[0].weeks.length).tickFormat(d3.time.format("%x")), $("li.capped-card").remove(), f = j.selectAll("li.capped-card").data(s).enter().append("li").attr("class", "capped-card").style("display", function(t) {
                    return t[c] < 1 ? "none" : "block"
                }), i = f.append("h3"), i.append("img").attr("src", function(t) {
                    return t.author.avatar
                }).attr("class", "avatar").attr("alt", ""), i.append("span").attr("class", "rank").text(function(t, e) {
                    return "#" + (e + 1)
                }), i.append("a").attr("class", "aname").attr("href", function(t) {
                    return "/" + t.author.login
                }).text(function(t) {
                    return t.author.login
                }), t = i.append("span").attr("class", "ameta"), m = $(".graphs").attr("data-repo-url"), t.append("span").attr("class", "cmeta").html(function(t) {
                    var e, n, i, s, a, r;
                    return e = "" + m + "/commits?author=" + t.author.login, r = "" + $.commafy(t.c) + " " + $.pluralize(t.c, "commit"), a = $("<a>", {
                        href: e,
                        "class": "cmt",
                        text: r
                    }), i = $("<span>", {
                        "class": "a",
                        text: "" + $.commafy(t.a) + " ++"
                    }), s = $("<span>", {
                        "class": "d",
                        text: "" + $.commafy(t.d) + " --"
                    }), n = " / ", $("<div>").append([a, n, i, n, s]).html()
                }), v = f.append("svg").attr("width", w + (u + d)).attr("height", n + h + r).attr("class", "capped-card-content").append("g").attr("transform", "translate(" + u + "," + h + ")"), v.append("g").attr("class", "x axis").attr("transform", "translate(0, " + (n - h - r) + ")").call(k).selectAll(".tick text").style("display", function(t, e) {
                    return e % 2 !== 0 ? "none" : "block"
                }), T = v.append("g").attr("class", "y axis").call(S).selectAll(".y.axis g text").attr("dx", w / 2).style("display", function(t, e) {
                    return 0 === e ? "none" : "block"
                }).classed("midlabel", !0), v.append("path").attr("d", function(t) {
                    return e(t.weeks)
                }), document.querySelector("#contributors").appendChild(p)
            }, w = function() {
                var t, e;
                return $.support.pjax ? (t = document.location, c = $("input[name=ctype]:checked").prop("value").toLowerCase(), e = "" + t.pathname + "?from=" + d(b) + "&to=" + d(l) + "&type=" + c, window.history.pushState(null, null, e)) : void 0
            }, h = function() {
                return c !== $(this).val() ? (w(), g(o)) : void 0
            }, o = p(s), g(s)
        })
    }.call(this),
    function() {
        var t, e, n, i, s, a, r, o;
        i = function(t) {
            var e;
            return (e = d3.format(","))(t)
        }, n = {
            top: 20,
            right: 40,
            bottom: 30,
            left: 40
        }, o = 980 - n.left - n.right, e = 150 - n.top - n.bottom, t = function(t) {
            return "<div class='blankslate'> <span class='mega-octicon octicon-graph'></span> <h3>No activity so far this " + t + "</h3> </div>"
        }, r = function(t) {
            var e;
            return e = 0 > t ? "octicon-arrow-down" : t > 0 ? "octicon-arrow-up" : "", "<span class='totals-num'> <span class='octicon " + e + "'></span> " + i(Math.abs(t)) + " change </span>"
        }, s = function(t) {
            var e, n;
            return e = 0 > t ? "octicon-arrow-down" : t > 0 ? "octicon-arrow-up" : "", n = 0 > t ? "decrease" : "increase", "<span class='totals-num'> <span class='octicon " + e + "'></span> " + i(Math.abs(t)) + "% " + n + " </span>"
        }, a = function(a, c) {
            var l, u, d, h, f, m, p, g, v, j, b, y, w, x, k, C, S, T, L, D, A, H, P, _, M, E, I, O;
            if (c && null == c.error) {
                for (f = c.counts, h = c.summary.columns, k = new Date(1e3 * c.summary.starting), p = new Date(1e3 * c.summary.ending), y = c.summary.model, w = c.summary.period, b = d3.max(d3.merge(d3.values(f)), function(t) {
                        return t.count
                    }), j = d3.time.format("%A, %B %-d, %Y"), g = d3.time.format("%-I%p"), u = d3.bisector(function(t) {
                        return t.date
                    }).left, M = 0, I = h.length; I > M; M++) d = h[M], $(".js-" + y + "-" + d + " .js-total").text(i(c.summary.totals[d])), $(".js-" + y + "-" + d + " .js-changes").append(r(c.summary.total_changes[d])), $(".js-" + y + "-" + d + " .js-changes").append(s(c.summary.percent_changes[d]));
                if (0 === d3.values(c.summary.totals).filter(function(t) {
                        return 0 !== t
                    }).length) return $(this).html(t(w));
                for (T = d3.tip().attr("class", "svg-tip total-unique comparison").offset([-10, 0]).html(function(t) {
                        var e, n, s, a, r, o;
                        for (s = "", e = function() {
                                switch (w) {
                                    case "year":
                                        return "Week of " + j(t.date);
                                    case "week":
                                        return "" + j(t.date) + " starting at " + g(t.date);
                                    default:
                                        return j(t.date)
                                }
                            }(), n = 270 / c.summary.columns.length, o = c.summary.columns, a = 0, r = o.length; r > a; a++) d = o[a], s += "<li class='totals " + d + "' style='width:" + n + "px'> <strong>" + i(t[d]) + "</strong> " + d.split("_at")[0] + " </li>";
                        return "<span class='title'>" + e + "</span> <ul> " + s + " </ul>"
                    }), x = function() {
                        var t, e, n, i, s, a, r, o, c, l;
                        for (r = {}, o = D.invert(d3.mouse(this)[0]), s = h[0], a = u(f[s], o, 1), e = f[s][a - 1], n = f[s][a], t = n && o - e.date > n.date - o ? a : a - 1, r.date = f[s][t].date, c = 0, l = h.length; l > c; c++) d = h[c], r[d] = f[d][t].count;
                        return i = L.selectAll("g.dots circle").filter(function(t) {
                            return t.date === r.date
                        }), T.show.call(this, r, i[0][0])
                    }, E = 0, O = h.length; O > E; E++) d = h[E], f[d].forEach(function(t) {
                    return t.date = new Date(1e3 * t.bucket)
                }), f[d] = f[d].filter(function(t) {
                    return t.date < new Date
                });
                return D = d3.time.scale().range([0, o]), H = d3.scale.linear().range([e, 0]), P = d3.scale.linear().range([e, 0]), C = 1, S = function() {
                    switch (w) {
                        case "year":
                            return d3.time.months;
                        case "week":
                            return C = 8, d3.time.hours;
                        default:
                            return C = 2, d3.time.days
                    }
                }(), A = d3.svg.axis().scale(D).tickSize(e + 5).tickPadding(10).ticks(S, C).orient("bottom"), _ = d3.svg.axis().scale(H).ticks(3).tickFormat(d3.formatSymbol).orient("left"), v = d3.svg.line().x(function(t) {
                    return D(t.date)
                }).y(function(t) {
                    return H(t.count)
                }), L = d3.select(this).append("svg").attr("width", o + n.left + n.right).attr("height", e + n.top + n.bottom).attr("class", "vis").append("g").attr("transform", "translate(" + n.left + "," + n.top + ")").call(T), D.domain([k, p]), H.domain([0, b]), L.append("g").attr("class", "x axis").call(A).selectAll("text").attr("text-anchor", "middle"), L.append("g").attr("class", "y axis").call(_), l = d3.values(f), L.selectAll("path.path").data(l).enter().append("path").attr("class", function(t) {
                    return "path total " + t[0].column
                }).attr("d", function(t) {
                    return v(t)
                }), m = L.selectAll("g.dots").data(l).enter().append("g").attr("class", function(t) {
                    return "dots totals " + t[0].column
                }), m.each(function() {
                    var t;
                    return t = d3.select(this), t.selectAll("circle").data(function(t) {
                        return f[t[0].column]
                    }).enter().append("circle").attr("cx", function(t) {
                        return D(t.date)
                    }).attr("cy", function(t) {
                        return H(t.count)
                    }).attr("r", 4)
                }), _.orient("right"), L.append("g").attr("class", "y axis unique").attr("transform", "translate(" + o + ", 0)").call(_), L.append("rect").attr("class", "overlay").attr("width", o).attr("height", e).on("mousemove", x).on("mouseout", function() {
                    return setTimeout(T.hide, 500)
                })
            }
        }, $(document).on("graph:load", ".js-dashboards-overview-graph", a)
    }.call(this),
    function() {
        var t, e;
        t = {}, $.observe(".js-graph", e = function(e) {
            var n, i, s;
            n = $(e), (i = n.attr("data-url")) && (n.find("svg").remove(), s = null != t[i] ? t[i] : t[i] = $.ajaxPoll({
                url: i
            }), n.addClass("is-graph-loading"), n.removeClass("is-graph-crunching is-graph-load-error is-graph-empty"), s.progress(function() {
                return n.addClass("is-graph-crunching")
            }), s.always(function() {
                return n.removeClass("is-graph-loading is-graph-crunching")
            }), s.done(function(t) {
                var e, i, s;
                return 0 === (null != t ? t.length : void 0) || 0 === (null != t && null != (e = t.summary) ? e.total : void 0) || 0 === (null != (i = t[0]) && null != (s = i.weeks) ? s.length : void 0) ? n.addClass("is-graph-empty") : d3Ready().then(function() {
                    return n.trigger("graph:load", [t])
                })
            }), s.fail(function() {
                return n.addClass("is-graph-load-error")
            }))
        })
    }.call(this),
    function() {
        var t, e, n, i, s, a, r = function(t, e) {
            return function() {
                return t.apply(e, arguments)
            }
        };
        i = function() {
            function i(t, e, n) {
                this.container = t, this.width = e, this.height = n, this.initError = r(this.initError, this), this.init = r(this.init, this), this.loaderInterval = null, this.loaderOffset = 0, this.ctx = this.initCanvas(t, e, n), this.startLoader("Loading graph data"), this.loadMeta()
            }
            return i.prototype.initCanvas = function(t) {
                var e, n, i, s, a, r, o;
                return s = t.getElementsByTagName("canvas")[0], s.style.zIndex = "0", i = s.width, n = s.height, a = s.getContext("2d"), r = window.devicePixelRatio || 1, e = a.webkitBackingStorePixelRatio || a.mozBackingStorePixelRatio || a.msBackingStorePixelRatio || a.oBackingStorePixelRatio || a.backingStorePixelRatio || 1, o = r / e, 1 === o ? a : (s.width = i * o, s.height = n * o, s.style.width = i + "px", s.style.height = n + "px", a.scale(o, o), a)
            }, i.prototype.startLoader = function(t) {
                return this.ctx.save(), this.ctx.font = "14px 'Helvetica Neue', Arial, sans-serif", this.ctx.fillStyle = "#cacaca", this.ctx.textAlign = "center", this.ctx.fillText(t, this.width / 2, 155), this.ctx.restore(), this.displayLoader()
            }, i.prototype.stopLoader = function() {
                var t;
                return t = this.container.querySelector(".large-loading-area"), t.classList.add("is-hidden")
            }, i.prototype.displayLoader = function() {
                var t;
                return t = this.container.querySelector(".large-loading-area"), t.classList.remove("is-hidden")
            }, i.prototype.loadMeta = function() {
                var t;
                return t = $.ajaxPoll({
                    url: this.container.getAttribute("data-network-graph-meta-url")
                }), t.then(this.init, this.initError)
            }, i.prototype.init = function(i) {
                var r, o, c, l, u, d;
                for (this.focus = i.focus, this.nethash = i.nethash, this.spaceMap = i.spacemap, this.userBlocks = i.blocks, this.commits = function() {
                        var e, n, s, a;
                        for (s = i.dates, a = [], o = e = 0, n = s.length; n > e; o = ++e) r = s[o], a.push(new t(o, r));
                        return a
                    }(), this.users = {}, d = i.users, l = 0, u = d.length; u > l; l++) c = d[l], this.users[c.name] = c;
                return this.chrome = new s(this, this.ctx, this.width, this.height, this.focus, this.commits, this.userBlocks, this.users), this.graph = new a(this, this.ctx, this.width, this.height, this.focus, this.commits, this.users, this.spaceMap, this.userBlocks, this.nethash), this.mouseDriver = new n(this.container, this.chrome, this.graph), this.keyDriver = new e(this.chrome, this.graph), this.stopLoader(), this.graph.drawBackground(), this.chrome.draw(), this.graph.requestInitialChunk()
            }, i.prototype.initError = function() {
                return this.stopLoader(), this.ctx.clearRect(0, 0, this.width, this.height), this.startLoader("Graph could not be drawn due to a network problem.")
            }, i
        }(), t = function() {
            function t(t, e) {
                this.time = t, this.date = new Date(e), this.requested = null, this.populated = null
            }
            return t.prototype.populate = function(t, e, n) {
                return this.user = e, this.author = t.author, this.date = new Date(t.date.replace(" ", "T")), this.gravatar = t.gravatar, this.id = t.id, this.login = t.login, this.message = t.message, this.space = t.space, this.time = t.time, this.parents = this.populateParents(t.parents, n), this.requested = !0, this.populated = new Date
            }, t.prototype.populateParents = function(t, e) {
                var n, i, s;
                return s = function() {
                    var s, a, r;
                    for (r = [], s = 0, a = t.length; a > s; s++) n = t[s], i = e[n[1]], i.id = n[0], i.space = n[2], r.push(i);
                    return r
                }()
            }, t
        }(), s = function() {
            function t(t, e, n, i, s, a, r, o) {
                this.network = t, this.ctx = e, this.width = n, this.height = i, this.commits = a, this.userBlocks = r, this.users = o, this.namesWidth = 120, this.months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], this.userBgColors = ["#fff", "#f7f7f7"], this.headerColor = "#f7f7f7", this.dividerColor = "#ddd", this.headerHeight = 40, this.dateRowHeight = 30, this.graphTopOffset = this.headerHeight + this.dateRowHeight, this.nameLineHeight = 24, this.offsetX = this.namesWidth + (n - this.namesWidth) / 2 - s * this.nameLineHeight, this.offsetY = 0, this.contentHeight = this.calcContentHeight(), this.graphMidpoint = this.namesWidth + (n - this.namesWidth) / 2, this.activeUser = null
            }
            return t.prototype.moveX = function(t) {
                return this.offsetX += t, this.offsetX > this.graphMidpoint ? this.offsetX = this.graphMidpoint : this.offsetX < this.graphMidpoint - this.commits.length * this.nameLineHeight ? this.offsetX = this.graphMidpoint - this.commits.length * this.nameLineHeight : void 0
            }, t.prototype.moveY = function(t) {
                return this.offsetY += t, this.offsetY > 0 || this.contentHeight < this.height - this.graphTopOffset ? this.offsetY = 0 : this.offsetY < -this.contentHeight + this.height / 2 ? this.offsetY = -this.contentHeight + this.height / 2 : void 0
            }, t.prototype.calcContentHeight = function() {
                var t, e, n, i, s;
                for (e = 0, s = this.userBlocks, n = 0, i = s.length; i > n; n++) t = s[n], e += t.count;
                return e * this.nameLineHeight
            }, t.prototype.hover = function(t, e) {
                var n, i, s, a;
                for (a = this.userBlocks, i = 0, s = a.length; s > i; i++)
                    if (n = a[i], t > 0 && t < this.namesWidth && e > this.graphTopOffset + this.offsetY + n.start * this.nameLineHeight && e < this.graphTopOffset + this.offsetY + (n.start + n.count) * this.nameLineHeight) return this.users[n.name];
                return null
            }, t.prototype.draw = function() {
                return this.drawTimeline(this.ctx), this.drawUsers(this.ctx)
            }, t.prototype.drawTimeline = function(t) {
                var e, n, i, s, a, r, o, c, l, u;
                for (t.fillStyle = this.headerColor, t.fillRect(0, 0, this.width, this.headerHeight), t.fillStyle = this.dividerColor, t.fillRect(0, this.headerHeight - 1, this.width, 1), c = parseInt((0 - this.offsetX) / this.nameLineHeight), 0 > c && (c = 0), o = c + parseInt(this.width / (this.nameLineHeight - 1)), o > this.commits.length && (o = this.commits.length), t.save(), t.translate(this.offsetX, 0), r = null, a = null, s = u = c; o >= c ? o > u : u > o; s = o >= c ? ++u : --u) e = this.commits[s], l = this.months[e.date.getMonth()], l !== r && (t.font = "bold 14px 'Helvetica Neue', Arial, sans-serif", t.fillStyle = "#555", t.fillText(l, s * this.nameLineHeight - 3, this.headerHeight / 2 + 4), r = l), i = e.date.getDate(), i !== a && (t.font = "12px 'Helvetica Neue', Arial, sans-serif", t.fillStyle = "#555", n = this.ctx.measureText(i).width, t.fillText(i, s * this.nameLineHeight - n / 2, this.headerHeight + this.dateRowHeight / 2 + 3), a = i, t.fillStyle = "#ddd", t.fillRect(s * this.nameLineHeight, this.headerHeight, 1, 6));
                return t.restore()
            }, t.prototype.drawUsers = function(t) {
                var e, n, i, s, a, r, o;
                for (t.fillStyle = "#fff", t.fillRect(0, 0, this.namesWidth, this.height), t.save(), t.translate(0, this.headerHeight + this.dateRowHeight + this.offsetY), o = this.userBlocks, n = a = 0, r = o.length; r > a; n = ++a) e = o[n], t.fillStyle = this.userBgColors[n % 2], t.fillRect(0, e.start * this.nameLineHeight, this.namesWidth, e.count * this.nameLineHeight), this.activeUser && this.activeUser.name === e.name && (t.fillStyle = "rgba(0, 0, 0, 0.05)", t.fillRect(0, e.start * this.nameLineHeight, this.namesWidth, e.count * this.nameLineHeight)), i = (e.start + e.count / 2) * this.nameLineHeight + 3, t.fillStyle = "rgba(0, 0, 0, 0.1)", t.fillRect(0, e.start * this.nameLineHeight + e.count * this.nameLineHeight - 1, this.namesWidth, 1), t.fillStyle = "#333", t.font = "13px 'Helvetica Neue', Arial, sans-serif", t.textAlign = "center", t.fillText(e.name, this.namesWidth / 2, i, 96);
                return t.restore(), t.fillStyle = this.headerColor, t.fillRect(0, 0, this.namesWidth, this.headerHeight), t.fillStyle = "#777", t.font = "12px 'Helvetica Neue', Arial, sans-serif", t.fillText("Owners", 40, this.headerHeight / 2 + 3), s = 10, t.fillStyle = this.dividerColor, t.fillRect(this.namesWidth - 1, s, 1, this.headerHeight - 2 * s), t.fillStyle = this.dividerColor, t.fillRect(0, this.headerHeight - 1, this.namesWidth, 1), t.fillStyle = this.dividerColor, t.fillRect(this.namesWidth - 1, this.headerHeight, 1, this.height - this.headerHeight)
            }, t
        }(), a = function() {
            function t(t, e, n, i, s, a, r, o, c, l) {
                var u, d, h, f, m, p, g, v, $, j, b, y, w, x, k;
                for (this.network = t, this.ctx = e, this.width = n, this.height = i, this.focus = s, this.commits = a, this.users = r, this.spaceMap = o, this.userBlocks = c, this.nethash = l, this.namesWidth = 120, this.headerHeight = 40, this.dateRowHeight = 30, this.graphTopOffset = 10 + this.headerHeight + this.dateRowHeight, this.bgColors = ["#fff", "#f9f9f9"], this.nameLineHeight = 24, this.spaceColors = ["#c0392b", "#3498db", "#2ecc71", "#8e44ad", "#f1c40f", "#e67e22", "#34495e", "#e74c3c", "#2980b9", "#1abc9c", "#9b59b6", "#f39c12", "#7f8c8d", "#2c3e50", "#d35400", "#e74c3c", "#95a5a6", "#bdc3c7", "#16a085", "#27ae60"], this.offsetX = this.namesWidth + (n - this.namesWidth) / 2 - s * this.nameLineHeight, this.offsetY = 0, this.bgCycle = 0, this.marginMap = {}, this.gravatars = {}, this.activeCommit = null, this.contentHeight = this.calcContentHeight(), this.graphMidpoint = this.namesWidth + (n - this.namesWidth) / 2, this.showRefs = !0, this.lastHotLoadCenterIndex = null, this.connectionMap = {}, this.spaceUserMap = {}, p = 0, j = c.length; j > p; p++)
                    for (u = c[p], f = g = w = u.start, x = u.start + u.count; x >= w ? x > g : g > x; f = x >= w ? ++g : --g) this.spaceUserMap[f] = r[u.name];
                for (this.headsMap = {}, v = 0, b = c.length; b > v; v++)
                    for (u = c[v], m = r[u.name], k = m.heads, $ = 0, y = k.length; y > $; $++) d = k[$], this.headsMap[d.id] || (this.headsMap[d.id] = []), h = {
                        name: m.name,
                        head: d
                    }, this.headsMap[d.id].push(h)
            }
            return t.prototype.moveX = function(t) {
                return this.offsetX += t, this.offsetX > this.graphMidpoint ? this.offsetX = this.graphMidpoint : this.offsetX < this.graphMidpoint - this.commits.length * this.nameLineHeight && (this.offsetX = this.graphMidpoint - this.commits.length * this.nameLineHeight), this.hotLoadCommits()
            }, t.prototype.moveY = function(t) {
                return this.offsetY += t, this.offsetY > 0 || this.contentHeight < this.height - 40 ? this.offsetY = 0 : this.offsetY < -this.contentHeight + this.height / 2 ? this.offsetY = -this.contentHeight + this.height / 2 : void 0
            }, t.prototype.toggleRefs = function() {
                return this.showRefs = !this.showRefs
            }, t.prototype.calcContentHeight = function() {
                var t, e, n, i, s;
                for (e = 0, s = this.userBlocks, n = 0, i = s.length; i > n; n++) t = s[n], e += t.count;
                return e * this.nameLineHeight
            }, t.prototype.hover = function(t, e) {
                var n, i, s, a, r, o, c, l;
                for (r = this.timeWindow(), i = o = c = r.min, l = r.max; l >= c ? l >= o : o >= l; i = l >= c ? ++o : --o)
                    if (n = this.commits[i], s = this.offsetX + n.time * this.nameLineHeight, a = this.offsetY + this.graphTopOffset + n.space * this.nameLineHeight, t > s - 5 && s + 5 > t && e > a - 5 && a + 5 > e) return n;
                return null
            }, t.prototype.hotLoadCommits = function() {
                var t, e, n, i, s, a;
                return s = 200, e = parseInt((-this.offsetX + this.graphMidpoint) / this.nameLineHeight), 0 > e && (e = 0), e > this.commits.length - 1 && (e = this.commits.length - 1), this.lastHotLoadCenterIndex && Math.abs(this.lastHotLoadCenterIndex - e) < 10 ? void 0 : (this.lastHotLoadCenterIndex = e, t = this.backSpan(e, s), i = this.frontSpan(e, s), t || i ? (a = t ? t[0] : i[0], n = i ? i[1] : t[1], this.requestChunk(a, n)) : void 0)
            }, t.prototype.backSpan = function(t, e) {
                var n, i, s, a, r, o;
                for (i = null, n = r = t;
                    (0 >= t ? 0 >= r : r >= 0) && n > t - e; n = 0 >= t ? ++r : --r)
                    if (!this.commits[n].requested) {
                        i = n;
                        break
                    }
                if (null !== i) {
                    for (s = null, a = null, n = o = i;
                        (0 >= i ? 0 >= o : o >= 0) && n > i - e; n = 0 >= i ? ++o : --o)
                        if (this.commits[n].requested) {
                            s = n;
                            break
                        }
                    return s ? a = s + 1 : (a = i - e, 0 > a && (a = 0)), [a, i]
                }
                return null
            }, t.prototype.frontSpan = function(t, e) {
                var n, i, s, a, r, o, c, l;
                for (i = null, n = r = t, c = this.commits.length;
                    (c >= t ? c > r : r > c) && t + e > n; n = c >= t ? ++r : --r)
                    if (!this.commits[n].requested) {
                        i = n;
                        break
                    }
                if (null !== i) {
                    for (s = null, a = null, n = o = i, l = this.commits.length;
                        (l >= i ? l > o : o > l) && i + e > n; n = l >= i ? ++o : --o)
                        if (this.commits[n].requested) {
                            s = n;
                            break
                        }
                    return a = s ? s - 1 : i + e >= this.commits.length ? this.commits.length - 1 : i + e, [i, a]
                }
                return null
            }, t.prototype.requestInitialChunk = function() {
                var t;
                return t = $.getJSON("network_data_chunk?nethash=" + this.nethash), t.then(function(t) {
                    return function(e) {
                        return t.importChunk(e), t.draw(), t.network.chrome.draw()
                    }
                }(this))
            }, t.prototype.requestChunk = function(t, e) {
                var n, i, s, a;
                for (n = a = t; e >= t ? e >= a : a >= e; n = e >= t ? ++a : --a) this.commits[n].requested = new Date;
                return s = "network_data_chunk?nethash=" + this.nethash + "&start=" + t + "&end=" + e, i = $.getJSON(s), i.then(function(t) {
                    return function(e) {
                        return t.importChunk(e), t.draw(), t.network.chrome.draw(), t.lastHotLoadCenterIndex = t.focus
                    }
                }(this))
            }, t.prototype.importChunk = function(t) {
                var e, n, i, s, a, r, o, c, l;
                if (t.commits) {
                    for (c = t.commits, l = [], r = 0, o = c.length; o > r; r++) e = c[r], a = this.spaceUserMap[e.space], n = this.commits[e.time], n.populate(e, a, this.commits), l.push(function() {
                        var t, e, a, r;
                        for (a = n.parents, r = [], t = 0, e = a.length; e > t; t++) s = a[t], r.push(function() {
                            var t, e, a, r;
                            for (r = [], i = t = e = s.time + 1, a = n.time; a >= e ? a > t : t > a; i = a >= e ? ++t : --t) this.connectionMap[i] = this.connectionMap[i] || [], r.push(this.connectionMap[i].push(n));
                            return r
                        }.call(this));
                        return r
                    }.call(this));
                    return l
                }
            }, t.prototype.timeWindow = function() {
                var t, e;
                return e = parseInt((this.namesWidth - this.offsetX + this.nameLineHeight) / this.nameLineHeight), 0 > e && (e = 0), t = e + parseInt((this.width - this.namesWidth) / this.nameLineHeight), t > this.commits.length - 1 && (t = this.commits.length - 1), {
                    min: e,
                    max: t
                }
            }, t.prototype.draw = function() {
                var t, e, n, i, s, a, r, o, c, l, u, d, h, f, m, p, g, v, $, j, b, y, w, x, k, C, S, T;
                for (this.drawBackground(), h = this.timeWindow(), c = h.min, o = h.max, this.ctx.save(), this.ctx.translate(this.offsetX, this.offsetY + this.graphTopOffset), n = {}, S = this.spaceMap, a = m = 0, $ = S.length; $ > m; a = ++m)
                    for (f = S[a], d = this.spaceMap.length - a - 1, r = p = c; o >= c ? o >= p : p >= o; r = o >= c ? ++p : --p) t = this.commits[r], t.populated && t.space === d && (this.drawConnection(t), n[t.id] = !0);
                for (a = g = c; o >= c ? o >= g : g >= o; a = o >= c ? ++g : --g)
                    if (e = this.connectionMap[a])
                        for (v = 0, j = e.length; j > v; v++) t = e[v], n[t.id] || (this.drawConnection(t), n[t.id] = !0);
                for (T = this.spaceMap, a = w = 0, b = T.length; b > w; a = ++w)
                    for (f = T[a], d = this.spaceMap.length - a - 1, r = x = c; o >= c ? o >= x : x >= o; r = o >= c ? ++x : --x) t = this.commits[r], t.populated && t.space === d && (t === this.activeCommit ? this.drawActiveCommit(t) : this.drawCommit(t));
                if (this.showRefs)
                    for (r = k = c; o >= c ? o >= k : k >= o; r = o >= c ? ++k : --k)
                        if (t = this.commits[r], t.populated && (s = this.headsMap[t.id]))
                            for (u = 0, C = 0, y = s.length; y > C; C++) i = s[C], this.spaceUserMap[t.space].name === i.name && (l = this.drawHead(t, i.head, u), u += l);
                return this.ctx.restore(), this.activeCommit ? this.drawCommitInfo(this.activeCommit) : void 0
            }, t.prototype.drawBackground = function() {
                var t, e, n, i, s;
                for (this.ctx.clearRect(0, 0, this.width, this.height), this.ctx.save(), this.ctx.translate(0, this.offsetY + this.graphTopOffset), this.ctx.clearRect(0, -10, this.width, this.height), s = this.userBlocks, e = n = 0, i = s.length; i > n; e = ++n) t = s[e], this.ctx.fillStyle = this.bgColors[e % 2], this.ctx.fillRect(0, t.start * this.nameLineHeight - 10, this.width, t.count * this.nameLineHeight), this.ctx.fillStyle = "#DDDDDD", this.ctx.fillRect(0, (t.start + t.count) * this.nameLineHeight - 11, this.width, 1);
                return this.ctx.restore()
            }, t.prototype.drawCommit = function(t) {
                var e, n;
                return e = t.time * this.nameLineHeight, n = t.space * this.nameLineHeight, this.ctx.beginPath(), this.ctx.arc(e, n, 3, 0, 2 * Math.PI, !1), this.ctx.fillStyle = this.spaceColor(t.space), this.ctx.fill()
            }, t.prototype.drawActiveCommit = function(t) {
                var e, n;
                return e = t.time * this.nameLineHeight, n = t.space * this.nameLineHeight, this.ctx.beginPath(), this.ctx.arc(e, n, 6, 0, 2 * Math.PI, !1), this.ctx.fillStyle = this.spaceColor(t.space), this.ctx.fill()
            }, t.prototype.drawCommitInfo = function(t) {
                var e, n, i, s, a, r, o, c, l, u;
                return e = 3, n = 340, u = 56, l = t.message ? this.splitLines(t.message, 48) : [], r = Math.max(u, 38 + 16 * l.length), i = this.offsetX + t.time * this.nameLineHeight, s = this.graphTopOffset + this.offsetY + t.space * this.nameLineHeight, o = 0, c = 0, o = i < this.graphMidpoint ? i + 10 : i - (n + 10), c = s < 40 + (this.height - 40) / 2 ? s + 10 : s - r - 10, this.ctx.save(), this.ctx.translate(o, c), this.ctx.fillStyle = "#fff", this.ctx.strokeStyle = "rgba(0, 0, 0, 0.2)", this.ctx.lineWidth = 1, this.roundRect(0, 0, n, r, e), a = this.gravatars[t.gravatar], a ? this.drawGravatar(a, 10, 10) : (a = new Image, a.src = t.gravatar, a.onload = function(e) {
                    return function() {
                        return e.activeCommit === t ? (e.drawGravatar(a, o + 10, c + 10), e.gravatars[t.gravatar] = a) : void 0
                    }
                }(this)), this.ctx.fillStyle = "#000", this.ctx.font = "bold 12px 'Helvetica Neue', Arial, sans-serif", this.ctx.fillText(t.author, 55, 24), this.ctx.fillStyle = "#bbb", this.ctx.font = "11px Consolas, Menlo, Courier, monospace", this.ctx.fillText(t.id.slice(0, 7), 280, 24), this.drawMessage(l, 55, 41), this.ctx.restore()
            }, t.prototype.drawGravatar = function(t, e, n) {
                var i;
                return i = 32, this.ctx.save(), this.ctx.fillStyle = "#fff", this.ctx.strokeStyle = "rgba(0, 0, 0, 0.0)", this.ctx.lineWidth = .1, this.roundRect(e + 2, n + 2, i, i, 4), this.ctx.clip(), this.ctx.drawImage(t, e + 2, n + 2, i, i), this.ctx.restore()
            }, t.prototype.roundRect = function(t, e, n, i, s) {
                return this.ctx.beginPath(), this.ctx.moveTo(t, e + s), this.ctx.lineTo(t, e + i - s), this.ctx.quadraticCurveTo(t, e + i, t + s, e + i), this.ctx.lineTo(t + n - s, e + i), this.ctx.quadraticCurveTo(t + n, e + i, t + n, e + i - s), this.ctx.lineTo(t + n, e + s), this.ctx.quadraticCurveTo(t + n, e, t + n - s, e), this.ctx.lineTo(t + s, e), this.ctx.quadraticCurveTo(t, e, t, e + s), this.ctx.fill(), this.ctx.stroke()
            }, t.prototype.drawMessage = function(t, e, n) {
                var i, s, a, r, o;
                for (this.ctx.font = "12px 'Helvetica Neue', Arial, sans-serif", this.ctx.fillStyle = "#000000", o = [], i = a = 0, r = t.length; r > a; i = ++a) s = t[i], o.push(this.ctx.fillText(s, e, n + 16 * i));
                return o
            }, t.prototype.splitLines = function(t, e) {
                var n, i, s, a, r, o;
                for (a = t.split(" "), i = [], n = "", r = 0, o = a.length; o > r; r++) s = a[r], n.length + 1 + s.length < e ? n = "" === n ? s : n + " " + s : (i.push(n), n = s);
                return i.push(n), i
            }, t.prototype.drawHead = function(t, e, n) {
                var i, s, a, r;
                return this.ctx.font = "11px 'Helvetica Neue', Arial, sans-serif", this.ctx.save(), i = this.ctx.measureText(e.name).width, this.ctx.restore(), a = t.time * this.nameLineHeight, r = t.space * this.nameLineHeight + 5 + n, s = 2.5, this.ctx.save(), this.ctx.translate(a, r - s), this.ctx.fillStyle = "rgba(0, 0, 0, 0.8)", this.ctx.beginPath(), this.ctx.moveTo(0, s), this.ctx.lineTo(-4, 10), this.ctx.quadraticCurveTo(-9, 10, -9, 15), this.ctx.lineTo(-9, 15 + i), this.ctx.quadraticCurveTo(-9, 15 + i + 5, -4, 15 + i + 5), this.ctx.lineTo(4, 15 + i + 5), this.ctx.quadraticCurveTo(9, 15 + i + 5, 9, 15 + i), this.ctx.lineTo(9, 15), this.ctx.quadraticCurveTo(9, 10, 4, 10), this.ctx.lineTo(0, s), this.ctx.fill(), this.ctx.fillStyle = "#fff", this.ctx.font = "12px 'Helvetica Neue', Arial, sans-serif", this.ctx.textBaseline = "middle", this.ctx.scale(.85, .85), this.ctx.rotate(Math.PI / 2), this.ctx.fillText(e.name, 19, -.5), this.ctx.restore(), i + this.nameLineHeight
            }, t.prototype.drawConnection = function(t) {
                var e, n, i, s, a, r;
                for (a = t.parents, r = [], e = i = 0, s = a.length; s > i; e = ++i) n = a[e], r.push(0 === e ? n.space === t.space ? this.drawBasicConnection(n, t) : this.drawBranchConnection(n, t) : this.drawMergeConnection(n, t));
                return r
            }, t.prototype.drawBasicConnection = function(t, e) {
                var n;
                return n = this.spaceColor(e.space), this.ctx.strokeStyle = n, this.ctx.lineWidth = 2, this.ctx.beginPath(), this.ctx.moveTo(t.time * this.nameLineHeight, e.space * this.nameLineHeight), this.ctx.lineTo(e.time * this.nameLineHeight, e.space * this.nameLineHeight), this.ctx.stroke()
            }, t.prototype.drawBranchConnection = function(t, e) {
                var n;
                return n = this.spaceColor(e.space), this.ctx.strokeStyle = n, this.ctx.lineWidth = 2, this.ctx.beginPath(), this.ctx.moveTo(t.time * this.nameLineHeight, t.space * this.nameLineHeight), this.ctx.lineTo(t.time * this.nameLineHeight, e.space * this.nameLineHeight), this.ctx.lineTo(e.time * this.nameLineHeight - 10, e.space * this.nameLineHeight), this.ctx.stroke(), this.threeClockArrow(n, e.time * this.nameLineHeight, e.space * this.nameLineHeight)
            }, t.prototype.drawMergeConnection = function(t, e) {
                var n, i, s;
                return n = this.spaceColor(t.space), this.ctx.strokeStyle = n, this.ctx.lineWidth = 2, this.ctx.beginPath(), t.space > e.space ? (this.ctx.moveTo(t.time * this.nameLineHeight, t.space * this.nameLineHeight), s = this.safePath(t.time, e.time, t.space), s ? (this.ctx.lineTo(e.time * this.nameLineHeight - 10, t.space * this.nameLineHeight), this.ctx.lineTo(e.time * this.nameLineHeight - 10, e.space * this.nameLineHeight + 15), this.ctx.lineTo(e.time * this.nameLineHeight - 5.7, e.space * this.nameLineHeight + 7.5), this.ctx.stroke(), this.oneClockArrow(n, e.time * this.nameLineHeight, e.space * this.nameLineHeight)) : (i = this.closestMargin(t.time, e.time, t.space, -1), t.space === e.space + 1 && t.space === i + 1 ? (this.ctx.lineTo(t.time * this.nameLineHeight, i * this.nameLineHeight + 10), this.ctx.lineTo(e.time * this.nameLineHeight - 15, i * this.nameLineHeight + 10), this.ctx.lineTo(e.time * this.nameLineHeight - 9.5, i * this.nameLineHeight + 7.7), this.ctx.stroke(), this.twoClockArrow(n, e.time * this.nameLineHeight, i * this.nameLineHeight), this.addMargin(t.time, e.time, i)) : t.time + 1 === e.time ? (i = this.closestMargin(t.time, e.time, e.space, 0), this.ctx.lineTo(t.time * this.nameLineHeight, i * this.nameLineHeight + 10), this.ctx.lineTo(e.time * this.nameLineHeight - 15, i * this.nameLineHeight + 10), this.ctx.lineTo(e.time * this.nameLineHeight - 15, e.space * this.nameLineHeight + 10), this.ctx.lineTo(e.time * this.nameLineHeight - 9.5, e.space * this.nameLineHeight + 7.7), this.ctx.stroke(), this.twoClockArrow(n, e.time * this.nameLineHeight, e.space * this.nameLineHeight), this.addMargin(t.time, e.time, i)) : (this.ctx.lineTo(t.time * this.nameLineHeight + 10, t.space * this.nameLineHeight - 10), this.ctx.lineTo(t.time * this.nameLineHeight + 10, i * this.nameLineHeight + 10), this.ctx.lineTo(e.time * this.nameLineHeight - 10, i * this.nameLineHeight + 10), this.ctx.lineTo(e.time * this.nameLineHeight - 10, e.space * this.nameLineHeight + 15), this.ctx.lineTo(e.time * this.nameLineHeight - 5.7, e.space * this.nameLineHeight + 7.5), this.ctx.stroke(), this.oneClockArrow(n, e.time * this.nameLineHeight, e.space * this.nameLineHeight), this.addMargin(t.time, e.time, i)))) : (i = this.closestMargin(t.time, e.time, e.space, -1), i < e.space ? (this.ctx.moveTo(t.time * this.nameLineHeight, t.space * this.nameLineHeight), this.ctx.lineTo(t.time * this.nameLineHeight, i * this.nameLineHeight + 10), this.ctx.lineTo(e.time * this.nameLineHeight - 12.7, i * this.nameLineHeight + 10), this.ctx.lineTo(e.time * this.nameLineHeight - 12.7, e.space * this.nameLineHeight - 10), this.ctx.lineTo(e.time * this.nameLineHeight - 9.4, e.space * this.nameLineHeight - 7.7), this.ctx.stroke(), this.fourClockArrow(n, e.time * this.nameLineHeight, e.space * this.nameLineHeight), this.addMargin(t.time, e.time, i)) : (this.ctx.moveTo(t.time * this.nameLineHeight, t.space * this.nameLineHeight), this.ctx.lineTo(t.time * this.nameLineHeight, i * this.nameLineHeight + 10), this.ctx.lineTo(e.time * this.nameLineHeight - 12.7, i * this.nameLineHeight + 10), this.ctx.lineTo(e.time * this.nameLineHeight - 12.7, e.space * this.nameLineHeight + 10), this.ctx.lineTo(e.time * this.nameLineHeight - 9.4, e.space * this.nameLineHeight + 7.7), this.ctx.stroke(), this.twoClockArrow(n, e.time * this.nameLineHeight, e.space * this.nameLineHeight), this.addMargin(t.time, e.time, i)))
            }, t.prototype.addMargin = function(t, e, n) {
                return this.marginMap[n] || (this.marginMap[n] = []), this.marginMap[n].push([t, e])
            }, t.prototype.oneClockArrow = function(t, e, n) {
                return this.ctx.fillStyle = t, this.ctx.beginPath(), this.ctx.moveTo(e - 3, n + 10.5), this.ctx.lineTo(e - 9, n + 5.5), this.ctx.lineTo(e - 2.6, n + 3.5), this.ctx.fill()
            }, t.prototype.twoClockArrow = function(t, e, n) {
                return this.ctx.fillStyle = t, this.ctx.beginPath(), this.ctx.moveTo(e - 12.4, n + 6.6), this.ctx.lineTo(e - 9.3, n + 10.6), this.ctx.lineTo(e - 3.2, n + 2.4), this.ctx.fill()
            }, t.prototype.threeClockArrow = function(t, e, n) {
                return this.ctx.fillStyle = t, this.ctx.beginPath(), this.ctx.moveTo(e - 10, n - 3.5), this.ctx.lineTo(e - 10, n + 3.5), this.ctx.lineTo(e - 4, n), this.ctx.fill()
            }, t.prototype.fourClockArrow = function(t, e, n) {
                return this.ctx.fillStyle = t, this.ctx.beginPath(), this.ctx.moveTo(e - 12.4, n - 6.6), this.ctx.lineTo(e - 9.3, n - 10.6), this.ctx.lineTo(e - 3.2, n - 2.4), this.ctx.fill()
            }, t.prototype.safePath = function(t, e, n) {
                var i, s, a, r;
                for (r = this.spaceMap[n], s = 0, a = r.length; a > s; s++)
                    if (i = r[s], this.timeInPath(t, i)) return i[1] === e;
                return !1
            }, t.prototype.closestMargin = function(t, e, n, i) {
                var s, a, r, o, c;
                for (o = this.spaceMap.length, r = i, a = !1, s = !1, c = !1; !s || !a;) {
                    if (n + r >= 0 && this.safeMargin(t, e, n + r)) return n + r;
                    0 > n + r && (a = !0), n + r > o && (s = !0), c === !1 && 0 === r ? (r = -1, c = !0) : r = 0 > r ? -r - 1 : -r - 2
                }
                return n > 0 ? n - 1 : 0
            }, t.prototype.safeMargin = function(t, e, n) {
                var i, s, a, r;
                if (!this.marginMap[n]) return !0;
                for (r = this.marginMap[n], s = 0, a = r.length; a > s; s++)
                    if (i = r[s], this.pathsCollide([t, e], i)) return !1;
                return !0
            }, t.prototype.pathsCollide = function(t, e) {
                return this.timeWithinPath(t[0], e) || this.timeWithinPath(t[1], e) || this.timeWithinPath(e[0], t) || this.timeWithinPath(e[1], t)
            }, t.prototype.timeInPath = function(t, e) {
                return t >= e[0] && t <= e[1]
            }, t.prototype.timeWithinPath = function(t, e) {
                return t > e[0] && t < e[1]
            }, t.prototype.spaceColor = function(t) {
                return 0 === t ? "#000000" : this.spaceColors[t % this.spaceColors.length]
            }, t
        }(), n = function() {
            function t(t, e, n) {
                this.chrome = e, this.graph = n, this.out = r(this.out, this), this.move = r(this.move, this), this.docmove = r(this.docmove, this), this.down = r(this.down, this), this.up = r(this.up, this), this.dragging = !1, this.lastPoint = {
                    x: 0,
                    y: 0
                }, this.lastHoverCommit = null, this.lastHoverUser = null, this.pressedCommit = null, this.pressedUser = null, this.canvas = t.getElementsByTagName("canvas")[0], this.canvasOffset = $(this.canvas).offset(), this.canvas.style.cursor = "move", document.body.addEventListener("mouseup", this.up), document.body.addEventListener("mousemove", this.docmove), this.canvas.addEventListener("mousedown", this.down), this.canvas.addEventListener("mousemove", this.move), this.canvas.addEventListener("mouseout", this.out)
            }
            return t.prototype.up = function() {
                return this.dragging = !1, this.pressedCommit && this.graph.activeCommit === this.pressedCommit ? window.open("/" + this.graph.activeCommit.user.name + "/" + this.graph.activeCommit.user.repo + "/commit/" + this.graph.activeCommit.id) : this.pressedUser && this.chrome.activeUser === this.pressedUser && (window.location = "/" + this.chrome.activeUser.name + "/" + this.chrome.activeUser.repo + "/network"), this.pressedCommit = null, this.pressedUser = null
            }, t.prototype.down = function() {
                return this.graph.activeCommit ? this.pressedCommit = this.graph.activeCommit : this.chrome.activeUser ? this.pressedUser = this.chrome.activeUser : this.dragging = !0
            }, t.prototype.docmove = function(t) {
                var e, n;
                return e = t.pageX, n = t.pageY, this.dragging && (this.graph.moveX(e - this.lastPoint.x), this.graph.moveY(n - this.lastPoint.y), this.graph.draw(), this.chrome.moveX(e - this.lastPoint.x), this.chrome.moveY(n - this.lastPoint.y), this.chrome.draw()), this.lastPoint.x = e, this.lastPoint.y = n
            }, t.prototype.move = function(t) {
                var e, n, i, s;
                return i = t.pageX, s = t.pageY, this.dragging ? (this.graph.moveX(i - this.lastPoint.x), this.graph.moveY(s - this.lastPoint.y), this.graph.draw(), this.chrome.moveX(i - this.lastPoint.x), this.chrome.moveY(s - this.lastPoint.y), this.chrome.draw()) : (n = this.chrome.hover(i - this.canvasOffset.left, s - this.canvasOffset.top), n !== this.lastHoverUser ? (this.canvas.style.cursor = n ? "pointer" : "move", this.chrome.activeUser = n, this.chrome.draw(), this.lastHoverUser = n) : (e = this.graph.hover(i - this.canvasOffset.left, s - this.canvasOffset.top), e !== this.lastHoverCommit && (this.canvas.style.cursor = e ? "pointer" : "move", this.graph.activeCommit = e, this.graph.draw(), this.chrome.draw(), this.lastHoverCommit = e))), this.lastPoint.x = i, this.lastPoint.y = s
            }, t.prototype.out = function() {
                return this.graph.activeCommit = null, this.chrome.activeUser = null, this.graph.draw(), this.chrome.draw(), this.lastHoverCommit = null, this.lastHoverUser = null
            }, t
        }(), e = function() {
            function t(t, e) {
                this.chrome = t, this.graph = e, this.down = r(this.down, this), this.dirty = !1, document.addEventListener("keydown", this.down)
            }
            return t.prototype.moveBothX = function(t) {
                return this.graph.moveX(t), this.chrome.moveX(t), this.graph.activeCommit = null, this.dirty = !0
            }, t.prototype.moveBothY = function(t) {
                return this.graph.moveY(t), this.chrome.moveY(t), this.graph.activeCommit = null, this.dirty = !0
            }, t.prototype.toggleRefs = function() {
                return this.graph.toggleRefs(), this.dirty = !0
            }, t.prototype.redraw = function() {
                return this.dirty && (this.graph.draw(), this.chrome.draw()), this.dirty = !1
            }, t.prototype.down = function(t) {
                if ($(t.target).is("input")) return !0;
                if (t.shiftKey) switch (t.which) {
                    case 37:
                    case 72:
                        return this.moveBothX(999999), this.redraw();
                    case 38:
                    case 75:
                        return this.moveBothY(999999), this.redraw();
                    case 39:
                    case 76:
                        return this.moveBothX(-999999), this.redraw();
                    case 40:
                    case 74:
                        return this.moveBothY(-999999), this.redraw()
                } else switch (t.which) {
                    case 37:
                    case 72:
                        return this.moveBothX(100), this.redraw();
                    case 38:
                    case 75:
                        return this.moveBothY(30), this.redraw();
                    case 39:
                    case 76:
                        return this.moveBothX(-100), this.redraw();
                    case 40:
                    case 74:
                        return this.moveBothY(-30), this.redraw();
                    case 84:
                        return this.toggleRefs(), this.redraw()
                }
            }, t
        }(), $.observe(".js-network-graph-container", function() {
            return new i(this, 920, 600)
        })
    }.call(this),
    function() {
        var t;
        t = function() {
            function t(t) {
                var e, n, i, s, a, r, o;
                this.el = $(t), this.canvas = t.getContext("2d"), i = window.devicePixelRatio || 1, n = this.canvas.webkitBackingStorePixelRatio || this.canvas.mozBackingStorePixelRatio || this.canvas.msBackingStorePixelRatio || this.canvas.oBackingStorePixelRatio || this.canvas.backingStorePixelRatio || 1, r = i / n, 1 !== r && (o = t.width, s = t.height, t.width = o * r, t.height = s * r, t.style.width = o + "px", t.style.height = s + "px", this.canvas.scale(r, r)), e = this.el.attr("data-color-all"), a = this.el.attr("data-color-owner"), null != e && (this.colors.all = e), null != a && (this.colors.owner = a), this.barMaxHeight = this.el.height(), this.barWidth = (this.el.width() - 52) / 52
            }
            return t.prototype.colors = {
                all: "#cacaca",
                owner: "#336699"
            }, t.prototype.getUrl = function() {
                return this.el.attr("data-source")
            }, t.prototype.setData = function(t) {
                var e, n;
                this.data = t, (null == (null != (e = this.data) ? e.all : void 0) || null == (null != (n = this.data) ? n.owner : void 0)) && (this.data = null), this.scale = this.getScale(this.data)
            }, t.prototype.getScale = function(t) {
                var e, n, i, s, a;
                if (null != t) {
                    for (e = t.all[0], a = t.all, i = 0, s = a.length; s > i; i++) n = a[i], n > e && (e = n);
                    return e >= this.barMaxHeight ? (this.barMaxHeight - .1) / e : 1
                }
            }, t.prototype.refresh = function() {
                var t;
                t = $.ajaxPoll({
                    url: this.getUrl(),
                    interval: 2e3
                }), t.then(function(t) {
                    return function(e) {
                        return t.setData(e), t.draw()
                    }
                }(this))
            }, t.prototype.draw = function() {
                null != this.data && (this.drawCommits(this.data.all, this.colors.all), this.drawCommits(this.data.owner, this.colors.owner))
            }, t.prototype.drawCommits = function(t, e) {
                var n, i, s, a, r, o, c, l;
                for (s = c = 0, l = t.length; l > c; s = ++c) n = t[s], a = this.barWidth, i = n * this.scale, r = s * (this.barWidth + 1), o = this.barMaxHeight - i, this.canvas.fillStyle = e, this.canvas.fillRect(r, o, a, i)
            }, t
        }(), $.observe(".js-participation-graph", function() {
            var e;
            e = new t(this), e.refresh()
        })
    }.call(this),
    function() {
        $(document).on("graph:load", ".js-pulse-authors-graph", function(t, e) {
            var n, i, s, a, r, o, c, l, u, d;
            return n = 15, e = e.slice(0, +(n - 1) + 1 || 9e9), a = {
                top: 20,
                right: 0,
                bottom: 30,
                left: 20
            }, c = $(this).width() - a.left - a.right, s = $(this).height() - a.top - a.bottom, l = d3.scale.ordinal().domain(d3.range(n)).rangeRoundBands([0, c], .2), u = d3.scale.linear().domain([0, d3.max(e, function(t) {
                return t.commits
            })]).range([s, 0]), d = d3.svg.axis().scale(u).orient("left").ticks(3).tickSize(-c).tickFormat(function(t) {
                return 1e3 > t ? t : d3.format(",s")(t)
            }), r = d3.tip().attr("class", "svg-tip").offset([-10, 0]).html(function(t) {
                var e;
                return "<strong>" + t.commits + "</strong> " + $.pluralize(t.commits, "commit") + " by <strong>" + (null != (e = t.login) ? e : t.name) + "</strong>"
            }), o = d3.select(this).append("svg").attr("width", c + a.left + a.right).attr("height", s + a.top + a.bottom).append("g").attr("transform", "translate(" + a.left + ", " + a.top + ")").call(r), o.append("g").attr("class", "y axis").call(d), i = o.selectAll(".bar").data(e).enter().append("g").attr("class", "bar").attr("transform", function(t, e) {
                return "translate(" + l(e) + ", 0)"
            }), i.append("rect").attr("width", l.rangeBand()).attr("height", function(t) {
                return s - u(t.commits)
            }).attr("y", function(t) {
                return u(t.commits)
            }).on("mouseover", r.show).on("mouseout", r.hide), i.append("a").attr("xlink:href", function(t) {
                return null != t.login ? "/" + t.login : void 0
            }).append("image").attr("y", s + 5).attr("xlink:href", function(t) {
                return t.gravatar
            }).attr("width", l.rangeBand()).attr("height", l.rangeBand())
        })
    }.call(this),
    function() {
        $(document).on("graph:load", ".js-graph-punchcard", function(t, e) {
            var n, i, s, a, r, o, c, l, u, d, h, f, m, p, g, v, j, b, y, w, x;
            return r = 500, b = $(this).width(), d = {}, e.forEach(function(t) {
                var e, n, i;
                return i = d3.weekdays[t[0]], e = null != d[i] ? d[i] : d[i] = [], n = t[1], null == e[n] && (e[n] = 0), e[n] += t[2]
            }), e = d3.entries(d).reverse(), x = [0, 0, 0, 20], p = x[0], f = x[1], m = x[2], h = x[3], c = 100, i = d3.range(7), o = d3.range(24), u = d3.min(e, function(t) {
                return d3.min(t.value)
            }), l = d3.max(e, function(t) {
                return d3.max(t.value)
            }), y = d3.scale.ordinal().domain(o).rangeRoundBands([0, b - c - f - m], .1), w = d3.scale.ordinal().domain(i).rangeRoundBands([r - p - h, 0], .1), g = d3.scale.sqrt().domain([0, l]).range([0, y.rangeBand() / 2]), v = d3.tip().attr("class", "svg-tip").offset([-10, 0]).html(function(t) {
                return "<strong>" + t + "</strong> " + $.pluralize(t, "commit")
            }), j = d3.select(this).data(e).attr("width", "" + b + "px").append("svg").attr("width", b + (f + m)).attr("height", r + p + h).attr("class", "viz").append("g").attr("transform", "translate(" + f + "," + p + ")").call(v), s = j.selectAll("g.day").data(e).enter().append("g").attr("class", "day").attr("transform", function(t, e) {
                return "translate(0, " + w(e) + ")"
            }), s.append("line").attr("x1", 0).attr("y1", w.rangeBand()).attr("x2", b - f - m).attr("y2", w.rangeBand()).attr("class", "axis"), s.append("text").attr("class", "day-name").text(function(t) {
                return t.key
            }).attr("dy", w.rangeBand() / 2), j.append("g").selectAll("text.hour").data(o).enter().append("text").attr("text-anchor", "middle").attr("transform", function(t, e) {
                return "translate(" + (y(e) + c) + ", " + r + ")"
            }).attr("class", "label").text(function(t) {
                var e;
                return e = t % 12 || 12, 0 === t || 12 > t ? "" + e + "a" : "" + e + "p"
            }), a = s.selectAll(".hour").data(function(t) {
                return t.value
            }).enter().append("g").attr("class", "hour").attr("transform", function(t, e) {
                return "translate(" + (y(e) + c) + ", 0)"
            }).attr("width", y.rangeBand()), a.append("line").attr("x1", 0).attr("y1", function(t, e) {
                return w.rangeBand() - (e % 2 === 0 ? 15 : 10)
            }).attr("x2", 0).attr("y2", w.rangeBand()).attr("class", function(t, e) {
                return e % 2 === 0 ? "axis even" : "axis odd"
            }), n = a.append("circle").attr("r", 0).attr("cy", w.rangeBand() / 2 - 5).attr("class", function() {
                return "day"
            }).on("mouseover", v.show).on("mouseout", v.hide), n.transition().attr("r", g)
        })
    }.call(this),
    function() {
        var t, e, n, i, s, a;
        i = function(t) {
            var e;
            return (e = d3.format(","))(t)
        }, n = {
            top: 20,
            right: 80,
            bottom: 30,
            left: 40
        }, a = 960 - n.left - n.right, e = 150 - n.top - n.bottom, t = function(t, e) {
            var n;
            return n = d3.time.format.utc("%A, %B %-d, %Y"), d3.tip().attr("class", "svg-tip web-views comparison").offset([-10, 0]).html(function(s) {
                return "<span class='title'>" + n(s.date) + "</span> <ul class='web-views'> <li class='totals'><strong>" + i(s.total) + "</strong> " + t + "</li> <li class='uniques'><strong>" + i(s.unique) + "</strong> " + e + "</li> </ul>"
            })
        }, s = function(t, s, r) {
            var o, c, l, u, d, h, f, m, p, g, v, j, b, y, w, x, k, C, S, T, L, D, A, H, P, _;
            if (s && null == s.error) {
                for (C = d3.time.scale.utc().range([0, a]), T = d3.scale.linear().range([e, 0]), L = d3.scale.linear().range([e, 0]), m = d3.time.format.utc("%m/%d"), S = d3.svg.axis().scale(C).tickSize(e + 5).tickPadding(10).tickFormat(m).orient("bottom"), D = d3.svg.axis().scale(T).ticks(3).tickFormat(d3.formatSymbol).orient("left"), h = d3.svg.line().x(function(t) {
                        return C(t.key)
                    }).y(function(t) {
                        return T(t.value)
                    }), w = d3.select(this).select(".js-graph").append("svg").attr("width", a + n.left + n.right).attr("height", e + n.top + n.bottom).attr("class", "vis").append("g").attr("transform", "translate(" + n.left + "," + n.top + ")").call(r), c = s.counts, c.forEach(function(t) {
                        return t.date = new Date(1e3 * t.bucket)
                    }), c.sort(function(t, e) {
                        return d3.ascending(t.date, e.date)
                    }), c = c.slice(-14), o = d3.bisector(function(t) {
                        return t.date
                    }).left, p = function() {
                        var t, e, n, i, s, a;
                        return a = C.invert(d3.mouse(this)[0]), s = o(c, a, 1), e = c[s - 1], n = c[s], e && n ? (t = a - e.date > n.date - a ? n : e, i = w.selectAll("g.dots circle").filter(function(e) {
                            return e.key === t.date
                        }), i = i[0], i.sort(function(t, e) {
                            return $(t).attr("cy") - $(e).attr("cy")
                        }), r.show.call(this, t, i[0])) : void 0
                    }, v = [], y = [], A = 0, H = c.length; H > A; A++) d = c[A], v.push({
                    key: d.date,
                    value: d.total
                }), y.push({
                    key: d.date,
                    value: d.unique
                });
                return f = [v, y], P = d3.extent(c, function(t) {
                    return t.date
                }), g = P[0], u = P[1], _ = d3.extent(v, function(t) {
                    return t.value
                }), k = _[0], x = _[1], j = d3.max(y, function(t) {
                    return t.value
                }), b = j + d3.median(y, function(t) {
                    return t.value
                }), C.domain([g, u]), T.domain([0, x]), L.domain([0, b]), $(this).find(".js-traffic-total").text(i(s.summary.total)), $(this).find(".js-traffic-uniques").text(i(s.summary.unique)), w.append("g").attr("class", "x axis").call(S), w.append("g").attr("class", "y axis views").call(D), w.selectAll("path.path").data(f).enter().append("path").attr("class", function(t, e) {
                    return "path " + (0 === e ? "total" : "unique")
                }).attr("d", function(t, e) {
                    return 0 === e ? h(t) : h.y(function(t) {
                        return L(t.value)
                    })(t)
                }), l = w.selectAll("g.dots").data(f).enter().append("g").attr("class", function(t, e) {
                    return 0 === e ? "dots totals" : "dots uniques"
                }), l.each(function(t, e) {
                    var n;
                    return n = d3.select(this), 1 === e && (T = L), n.selectAll("circle").data(function(t) {
                        return t
                    }).enter().append("circle").attr("cx", function(t) {
                        return C(t.key)
                    }).attr("cy", function(t) {
                        return T(t.value)
                    }).attr("r", 4)
                }), D.scale(L).orient("right"), w.append("g").attr("class", "y axis unique").attr("transform", "translate(" + a + ", 0)").call(D), w.append("rect").attr("class", "overlay").attr("width", a).attr("height", e).on("mousemove", p).on("mouseout", function() {
                    return setTimeout(r.hide, 500)
                })
            }
        }, $(document).on("graph:load", "#js-visitors-graph", function(e, n) {
            var i;
            return i = t("visitors", "unique visitors"), $.observe("#js-visitors-graph .js-graph", {
                remove: i.hide
            }), s.apply(this, [e, n, i])
        }), $(document).on("graph:load", "#js-clones-graph", function(e, n) {
            var i;
            return i = t("clones", "unique cloners"), $.observe("#js-clones-graph .js-graph", {
                remove: i.hide
            }), s.apply(this, [e, n, i])
        }), $(document).on("click", ".js-domain-list", function(t) {
            return t.preventDefault(), $(".js-top-paths").fadeOut("fast", function() {
                return $(".js-top-domains").fadeIn("fast")
            })
        }), $(document).on("click", ".js-domain", function(t) {
            return t.preventDefault(), $.ajax({
                url: $(this).attr("href"),
                beforeSend: function() {
                    return $(".js-top-domains").hide(), $(".js-spinner").show()
                }
            }).done(function(t) {
                return $(".js-spinner").hide(), $(".js-top-paths").html(t).fadeIn("fast")
            })
        })
    }.call(this),
    function() {
        $(document).on("click", ".js-skip-to-content", function() {
            return $("#start-of-content").next().attr("tabindex", "-1").focus()
        })
    }.call(this),
    function() {
        var t, e = function(t, e) {
            return function() {
                return t.apply(e, arguments)
            }
        };
        t = function() {
            function t(t) {
                this.input = t, this.enableNavigation = e(this.enableNavigation, this), this.loadSuggestions = e(this.loadSuggestions, this), this.onNavigationOpen = e(this.onNavigationOpen, this), this.onNavigationKeyDown = e(this.onNavigationKeyDown, this), this.onKeyUp = e(this.onKeyUp, this), this.deactivate = e(this.deactivate, this), this.activate = e(this.activate, this), this.container = e(this.container, this), this.list = e(this.list, this), $(this.input).attr("data-member-adder-activated") || ($(this.input).attr("data-member-adder-activated", !0), $(this.input).on("focusout:delayed.member-adder", this.deactivate), $(this.input).on("focusin:delayed.member-adder", this.activate), $(this.input).on("keyup.member-adder", this.onKeyUp), $(this.input).on("throttled:input.member-adder", this.loadSuggestions), this.spinner = document.getElementById($(this.input).attr("data-spinner")), this.container().on("navigation:keydown.member-adder", "[data-value]", this.onNavigationKeyDown), this.container().on("navigation:open.member-adder", "[data-value]", this.onNavigationOpen), this.sudo = $(this.input).attr("data-sudo-required"), this.blankSlate = this.container().html(), this.added = {})
            }
            return t.prototype.list = function() {
                return this._list || (this._list = $(document.getElementById($(this.input).attr("data-member-list"))))
            }, t.prototype.container = function() {
                return this._container || (this._container = $(document.getElementById($(this.input).attr("data-member-adder"))))
            }, t.prototype.activate = function() {
                return !this.container().is(".active") && this.query ? (this.container().addClass("active"), this.enableNavigation()) : void 0
            }, t.prototype.deactivate = function() {
                this.container().removeClass("active"), this.container().find(".suggestions").hide(), this.container().html(this.blankSlate), $(this.input).removeClass("js-navigation-enable"), this.container().navigation("pop")
            }, t.prototype.onKeyUp = function() {
                var t;
                return t = $(this.input).val(), t !== this.query ? (this.query = t) ? (this.search(t), this.activate(), this.query) : (this.query = null, void this.deactivate()) : void 0
            }, t.prototype.onNavigationKeyDown = function(t) {
                switch (t.hotkey) {
                    case "tab":
                        return this.onNavigationOpen(t), !1;
                    case "esc":
                        return this.deactivate(), !1
                }
            }, t.prototype.onNavigationOpen = function(t) {
                var e, n, i, s, a;
                return e = $(t.target), e.hasClass("disabled") || (s = e.attr("data-value"), this.input.value = "", i = this.container().attr("data-add-url"), null != (a = this.ajax) && a.abort(), n = this.sudo ? $.sudo() : Promise.resolve(), n.then(function(t) {
                    return function() {
                        return t.startSpinner(), i ? $.ajax({
                            url: i,
                            type: "post",
                            data: {
                                member: s
                            },
                            complete: function(e) {
                                return t.stopSpinner(), 200 === e.status ? (t.list().prepend(e.responseText), t.list().trigger("member-adder:added", s), t.added[s] = !0, t.deactivate()) : t.list().trigger("member-adder:error", [s, e])
                            }
                        }) : (t.stopSpinner(), 0 === t.list().find("li[data-value='" + s + "']").length && (t.list().prepend(t.container().find("li[data-value='" + s + "']").clone()), t.list().trigger("member-adder:added", s))), t.deactivate(), t.input.focus()
                    }
                }(this))), this.deactivate(), this.input.focus(), !1
            }, t.prototype.startSpinner = function() {
                return this.spinner && $(this.spinner).length ? $(this.spinner).removeClass("hidden") : void 0
            }, t.prototype.stopSpinner = function() {
                return this.spinner && $(this.spinner).length ? $(this.spinner).addClass("hidden") : void 0
            }, t.prototype.search = function() {
                var t, e;
                return e = this.container().find("ul"), e[0] ? (t = this.container().find(".js-no-results"), this.container().addClass("active"), e.find("li").length > 0 ? (t.addClass("hidden"), this.enableNavigation()) : (t.removeClass("hidden"), t.addClass("active"))) : void 0
            }, t.prototype.loadSuggestions = function() {
                var t, e;
                if ((t = this.query) && (e = this.container().attr("data-search-url")) && !this.ajax) return this.startSpinner(), this.ajax = $.ajax({
                    url: e,
                    data: {
                        query: t
                    },
                    complete: function(t) {
                        return function() {
                            return t.ajax = null, t.stopSpinner()
                        }
                    }(this),
                    success: function(t) {
                        return function(e) {
                            var n;
                            return n = $($.parseHTML(e)), t.container().html(n), t.query = null, t.onKeyUp()
                        }
                    }(this)
                })
            }, t.prototype.enableNavigation = function() {
                return $(this.input).addClass("js-navigation-enable"), this.container().navigation("push"), this.container().navigation("focus")
            }, t
        }(), $.observe("input[data-member-adder]", function() {
            new t(this)
        })
    }.call(this),
    function() {
        $(document).on("submit", ".js-mobile-preference-form", function() {
            var t;
            return t = $(this).find(".js-mobile-preference-anchor-field"), t.val(window.location.hash.substr(1)), !0
        })
    }.call(this),
    function() {
        var t, e;
        $(document).on("click", ".js-org-billing-plans .js-choose-plan", function() {
            return t($(this).closest(".js-plan-row")), !1
        }), t = function(t) {
            var n, i, s, a;
            return s = t.attr("data-name"), i = parseInt(t.attr("data-cost"), 10), n = parseInt(null != (a = t.attr("data-balance")) ? a : "0", 10), $(".js-org-billing-plans").find(".js-plan-row, .js-choose-plan").removeClass("selected"), t.find(".js-choose-plan").addClass("selected"), t.addClass("selected"), $(".js-plan").val(s), 0 === i && 0 === n ? $(".js-billing-section").addClass("has-removed-contents") : ($(".js-billing-section").removeClass("has-removed-contents"), null != t.attr("data-balance") ? e(s) : void 0)
        }, e = function(t) {
            return $(".js-plan-change-message").addClass("is-hidden"), $('.js-plan-change-message[data-name="' + t + '"]').removeClass("is-hidden")
        }, $(function() {
            return $(".selected .js-choose-plan").click()
        })
    }.call(this),
    function() {
        var t, e;
        t = function() {
            var t, n, i, s, a, r;
            return a = [], n = $(".js-advanced-search-input").val(), r = {
                Repositories: 0,
                Users: 0,
                Code: 0
            }, t = $("input[type=text].js-advanced-search-prefix, select.js-advanced-search-prefix"), a = e(t, function(t, e, n) {
                return "" === t ? "" : ("" !== e && r[n] ++, "" !== e ? "" + t + e : void 0)
            }), $.merge(a, e($("input[type=checkbox].js-advanced-search-prefix"), function(t, e, n) {
                var i;
                return i = $(this).prop("checked"), i !== !1 && r[n] ++, i !== !1 ? "" + t + i : void 0
            })), i = function(t) {
                return t.Users > t.Code && t.Users > t.Repositories ? "Users" : t.Code > t.Users && t.Code > t.Repositories ? "Code" : "Repositories"
            }, s = $.trim(a.join(" ")), $(".js-type-value").val(i(r)), $(".js-search-query").val($.trim("" + n + " " + s)), $(".js-advanced-query").empty(), $(".js-advanced-query").text("" + s), $(".js-advanced-query").prepend($("<span>").text($.trim(n)), " ")
        }, e = function(t, e) {
            return $.map(t, function(t) {
                var n, i, s, a;
                return s = $.trim($(t).val()), n = $(t).attr("data-search-prefix"), i = $(t).attr("data-search-type"), a = function(t) {
                    return -1 !== t.search(/\s/g) ? '"' + t + '"' : t
                }, "" === n ? e.call(t, n, s, i) : -1 !== s.search(/\,/g) && "location" !== n ? s.split(/\,/).map(function(s) {
                    return e.call(t, n, a($.trim(s)), i)
                }) : e.call(t, n, a(s), i)
            })
        }, $(document).onFocusedInput(".js-advanced-search-prefix", function() {
            return function() {
                return t()
            }
        }), $(document).on("change", ".js-advanced-search-prefix", t), $(document).on("focusin", ".js-advanced-search-input", function() {
            return $(this).closest(".js-advanced-search-label").addClass("focus")
        }), $(document).on("focusout", ".js-advanced-search-input", function() {
            return $(this).closest(".js-advanced-search-label").removeClass("focus")
        }), $(document).on("click", ".js-see-all-search-cheatsheet", function() {
            return $(".js-more-cheatsheet-info").removeClass("hidden"), !1
        }), $(function() {
            return $(".js-advanced-search-input").length ? t() : void 0
        })
    }.call(this),
    function() {
        $(document).delegate(".audit-search-form .js-suggester", "navigation:open", function() {
            return $(this).closest("form").submit()
        })
    }.call(this),
    function() {
        var t, e, n, i, s, a, r, o, c, l;
        s = function(t) {
            var e, n, i, s, a;
            if (n = t.match(/\#?(?:L|-)(\d+)/gi)) {
                for (a = [], i = 0, s = n.length; s > i; i++) e = n[i], a.push(parseInt(e.replace(/\D/g, "")));
                return a
            }
            return []
        }, n = function(t) {
            var e;
            return (e = t.match(/(file-.+?-)L\d+?/i)) ? e[1] : ""
        }, i = function(t) {
            return {
                lineRange: s(t),
                anchorPrefix: n(t)
            }
        }, t = function(t) {
            var e, n;
            switch (n = t.lineRange, e = t.anchorPrefix, n.sort(c), n.length) {
                case 1:
                    return "#" + e + "L" + n[0];
                case 2:
                    return "#" + e + "L" + n[0] + "-L" + n[1];
                default:
                    return "#"
            }
        }, c = function(t, e) {
            return t - e
        }, o = !1, e = function(t) {
            var e, n, i, s, a;
            if (s = t.lineRange, e = t.anchorPrefix, i = $(".js-file-line"), i.length) {
                if (i.css("background-color", ""), 1 === s.length) return $("#" + e + "LC" + s[0]).css("background-color", "#f8eec7");
                if (s.length > 1) {
                    for (n = s[0], a = []; n <= s[1];) $("#" + e + "LC" + n).css("background-color", "#f8eec7"), a.push(n++);
                    return a
                }
            }
        }, r = function(t) {
            var n, s, a;
            return null == t && (t = i(window.location.hash)), a = t.lineRange, n = t.anchorPrefix, e(t), !o && (s = $("#" + n + "LC" + a[0])).length && $(window).scrollTop(s.offset().top - .33 * $(window).height()), o = !1
        }, l = function(t, e) {
            var n, i, s, a, r;
            for (null == e && (e = window.location.hash), r = [], s = 0, a = t.length; a > s; s++) i = t[s], r.push(e ? i.hash = e : (n = i.href.indexOf("#")) >= 0 ? i.href = i.href.substr(0, n) : void 0);
            return r
        }, $.hashChange(function() {
            return $(".js-file-line-container").length ? (setTimeout(r, 0), l($(".js-update-url-with-hash"))) : void 0
        }), a = function(t) {
            var e, n;
            return o = !0, e = null != (n = $(window).scrollTop()) ? n : 0, t(), $(window).scrollTop(e)
        }, $(document).on("mousedown", ".js-line-number", function(e) {
            var n, r;
            return n = i(this.id), e.shiftKey && (r = s(window.location.hash), n.lineRange.unshift(r[0])), a(function() {
                return window.location.hash = t(n)
            }), !1
        }), $(document).on("submit", ".js-jump-to-line-form", function() {
            var t, e;
            return t = $(this).find(".js-jump-to-line-field")[0], (e = t.value.replace(/[^\d\-]/g, "")) && (window.location.hash = "L" + e), $(document).trigger("close.facebox"), !1
        })
    }.call(this),
    function() {
        var t, e, n, i, s, a, r, o, c, l, u, d, h;
        a = function(t) {
            var e, n;
            return e = t.find(".js-blob-filename"), e[0] ? e.val() === e.attr("data-default-value") ? !1 : "." === (n = e.val()) || ".." === n || ".git" === n ? !1 : /\S/.test(e.val()) : !0
        }, t = function(t) {
            var e;
            return e = t.find(".js-blob-contents")[0], e ? $(e).attr("data-allow-unchanged") ? !0 : $(e).attr("data-new-filename") ? !0 : e.value !== e.defaultValue : !0
        }, e = function(e) {
            return e = $(".js-blob-form"), e.find(".js-check-for-fork").is($.visible) ? !1 : a(e) && t(e)
        }, l = function(t) {
            var e;
            return e = t.find(".js-blob-contents")[0], e ? $(e).attr("data-allow-unchanged") ? !0 : e.value !== e.defaultValue : !1
        }, o = function() {
            var t;
            return t = $(".js-blob-form"), t.find(".js-blob-submit").prop("disabled", !e(t)), t.find(".js-blob-contents-changed").val(l(t))
        }, $.observe(".js-blob-form", function() {
            o()
        }), $(document).on("change", ".js-blob-contents", function() {
            return c($(".js-blob-filename")), o()
        }), $(document).on("click", ".js-new-blob-submit", function() {
            return $(this).closest("form.js-new-blob-form").submit()
        }), $(document).onFocusedInput(".js-blob-filename", function() {
            return function() {
                return $(".js-blob-contents").attr("data-filename", $(this).val()), r($(this).val()), c($(this))
            }
        }), $(document).onFocusedInput(".js-breadcrumb-nav", function() {
            return function() {
                return h($(this)), c($(this))
            }
        }), $(document).onFocusedKeydown(".js-breadcrumb-nav", function() {
            return function(t) {
                var e, n, i;
                return n = $(this).caretSelection(), i = [0, 0], e = 0 === $(n).not(i).length && 0 === $(i).not(n).length, e && 8 === t.keyCode && 1 !== $(this).parent().children(".separator").length && (s($(this), !0), t.preventDefault()), c($(this))
            }
        }), c = function(t) {
            return null != t[0] && (d(t), u(t)), o()
        }, h = function(t) {
            var e, n, a, r, o, c;
            for (c = []; t.val().split("/").length > 1;) e = t.val(), a = e.split("/"), n = a[0], o = a.slice(1).join("/"), "" === n || "." === n || ".git" === n ? (t.val(o), r = function() {
                return t.caret(0)
            }, c.push(window.setTimeout(r, 1))) : c.push(".." === n ? s(t) : i(t, n, o));
            return c
        }, r = function(t) {
            var e, n;
            return e = $(".js-gitignore-template"), n = $(".js-license-template"), /^(.+\/)?\.gitignore$/.test(t) ? e.addClass("is-visible") : /^(.+\/)?(licen[sc]e|copying)($|\.)/i.test(t) ? n.addClass("is-visible") : (e.removeClass("is-visible"), n.removeClass("is-visible"))
        }, u = function(t) {
            var e, n, i, s, a, r, o, c, l, u, d, h;
            return i = t.closest("form"), n = $(".js-blob-contents"), e = i.find(".js-new-blob-commit-summary"), o = t.val() ? "Create " + t.val() : "Create new file", d = n.attr("data-old-filename"), c = $(".js-new-filename-field").val(), n.removeAttr("data-new-filename"), o = d.length && c !== d && null != t[0] ? (n.attr("data-new-filename", "true"), a = n[0].value !== n[0].defaultValue, s = a ? "Update and rename" : "Rename", t.val().length && c.length ? (h = d.split("/"), l = c.split("/"), u = !0, r = h.length - 1, h.forEach(function(t, e) {
                return e !== r && t !== l[e] ? u = !1 : void 0
            }), h.length === l.length && u ? "" + s + " " + h[r] + " to " + l[r] : "" + s + " " + d + " to " + c) : "" + s + " " + d) : d.length && c === d ? "Update " + t.val() : o, e.attr("placeholder", o), $(".js-commit-message-fallback").val(o)
        }, d = function(t) {
            var e, n;
            return e = $(".breadcrumb").children("[itemscope]"), n = "", e.each(function() {
                var t;
                return t = $(this), n = n + t.text() + "/"
            }), n += t.val(), $(".js-new-filename-field").val(n)
        }, s = function(t, e) {
            var n, i;
            return null == e && (e = !1), e || t.val(t.val().replace("../", "")), i = function() {
                return t.caret(0)
            }, 1 !== t.parent().children(".separator").length && (t.prev().remove(), n = t.prev().children().children().html(), t.prev().remove(), e && (t.val("" + n + t.val()), i = function() {
                return e ? t.caret(n.length) : void 0
            })), r(t.val()), window.setTimeout(i, 1)
        }, i = function(t, e, n) {
            var i, s, a, o, c, l, u;
            return null == n && (n = ""), e = e.replace(/[^-.a-z_0-9]+/gi, "-"), e = e.replace(/^-+|-+$/g, ""), e.length > 0 && (u = t.parent().children(".js-repo-root, [itemtype]").children("a").last().attr("href"), u || (i = t.parent().children(".js-repo-root, [itemtype]").children("span").children("a").last(), s = i.attr("data-branch"), c = i.attr("href"), u = "" + c + "/tree/" + s), a = $(".js-crumb-template").clone().removeClass("js-crumb-template"), a.find("a[itemscope]").attr("href", "" + u + "/" + e), a.find("span").text(e), o = $(".js-crumb-separator").clone().removeClass("js-crumb-separator"), t.before(a, o)), t.val(n), r(t.val()), l = function() {
                return t.caret(0)
            }, window.setTimeout(l, 1)
        }, $(document).onFocusedInput(".js-new-blob-commit-summary", function() {
            var t;
            return t = $(this).closest(".js-file-commit-form"),
                function() {
                    return t.toggleClass("is-too-long-error", $(this).val().length > 50)
                }
        }), n = function(t) {
            var e, n, i;
            if (!t.data("checking-for-fork")) return o(), e = function() {
                return t.hide(), o()
            }, n = function() {
                return t.html('<span class="octicon octicon-alert"></span>\nSomething went wrong. Please fork the project, then try from your fork.')
            }, i = t.attr("data-check-url"), $.ajaxPoll({
                url: i,
                status: 404
            }).then(e, n), t.data("checking-for-fork", !0)
        }, $.observe(".js-check-for-fork", function() {
            n($(this))
        }), $(document).on("change", ".js-gitignore-template input[type=radio]", function() {
            var t;
            return t = $(this).closest(".js-blob-form").find(".js-code-editor").data("code-editor"), $.ajax({
                type: "GET",
                url: $(this).attr("data-template-url"),
                success: function(e) {
                    return t.setCode(e)
                }
            })
        }), $(document).on("change", ".js-license-template input[type=radio]", function() {
            var t, e;
            return t = $(this).closest(".js-blob-form").find(".js-code-editor").data("code-editor"), e = $(this).attr("data-template-contents"), t.setCode(e)
        }), $(document).onFocusedKeydown(".js-new-blob-commit-description", function() {
            return function(t) {
                return "ctrl+enter" === t.hotkey || "meta+enter" === t.hotkey ? ($(this).closest("form").submit(), !1) : void 0
            }
        })
    }.call(this),
    function() {
        var t;
        t = null, $(document).focused(".js-branch-search-field")["in"](function() {
            var e, n, i, s, a, r, o, c, l, u, d, h, f, m;
            return n = $(this), i = n.closest(".js-branch-search"), e = i.closest(".js-branches"), s = e.find(".js-branches-subnav .js-subnav-item"), f = i.prop("action"), h = i.attr("data-reset-url"), m = i.attr("data-results-container"), l = /\S/, o = function() {
                return l.test(n.val())
            }, u = function(t, e) {
                var n;
                return $.support.pjax && window.history.replaceState(null, "", e), n = document.getElementById(m), $(n).html(t)
            }, r = null, a = function(t) {
                return r && r.readyState < 4 && r.abort(), r = $.ajax(t)
            }, c = function() {
                var n, r;
                return null === t && (t = s.filter(".selected")), n = o(), r = n ? f + "?" + i.serialize() : h, a({
                    url: r,
                    context: i
                }).always(function() {
                    return e.removeClass("is-loading")
                }).done(function(t) {
                    return u(t, r)
                }), e.toggleClass("is-search-mode", n), e.addClass("is-loading"), s.removeClass("selected"), n ? s.filter(".js-branches-all").addClass("selected") : (t.addClass("selected"), t = null)
            }, d = function() {
                var t;
                return t = o(), n.val(""), t ? c() : void 0
            }, n.on("throttled:input.autosearch_form", c), n.on("keyup.autosearch_form", function(t) {
                return "esc" === t.hotkey ? (d(), this.blur()) : void 0
            })
        }).out(function() {
            return $(this).off(".autosearch_form")
        }), $(document).on("submit", ".js-branch-search", !1), $(document).on("click", ".js-clear-branch-search", function(t) {
            var e;
            if (1 === t.which) return e = $(this).closest(".js-branch-search").find(".js-branch-search-field"), e.focus().val("").trigger("input"), t.preventDefault()
        }), $(document).on("ajaxSend", ".js-branch-destroy, .js-branch-restore", function(t, e) {
            var n, i, s, a, r;
            return i = $(this), r = i.is(".js-branch-destroy"), a = i.closest(".js-branch-row").attr("data-branch-name"), n = i.closest(".js-branches").find(".js-branch-row").filter(function() {
                return this.getAttribute("data-branch-name") === a
            }), s = i.find("button[type=submit]"), s.blur().removeClass("tooltipped"), n.addClass("loading"), e.done(function() {
                return n.toggleClass("is-deleted", r)
            }).always(function() {
                return n.removeClass("loading"), s.addClass("tooltipped")
            })
        })
    }.call(this),
    function() {
        $(document).on("change", "#js-inline-comments-toggle", function() {
            return $("#comments").toggleClass("only-commit-comments", !this.checked)
        })
    }.call(this),
    function() {
        $(document).on("navigation:keyopen", ".commits-list-item", function() {
            return $(this).find(".commit-title > a").first().click(), !1
        }), $(document).on("navigation:keydown", ".commits-list-item", function(t) {
            return "c" === t.hotkey ? ($(this).find(".commit-title > a").first().click(), !1) : void 0
        })
    }.call(this),
    function() {
        $(document).on("click", ".js-compare-tabs a", function() {
            return $(this).closest(".js-compare-tabs").find("a").removeClass("selected"), $(this).addClass("selected"), $("#commits_bucket, #files_bucket, #commit_comments_bucket").hide(), $(this.hash).show(), !1
        }), $.hashChange(function() {
            return $(this).closest("#files_bucket")[0] && !$(this).is($.visible) ? $('a.tabnav-tab[href="#files_bucket"]').click() : void 0
        }), $(document).on("click", ".js-toggle-range-editor", function() {
            var t;
            return t = $(this).closest(".js-range-editor"), t.hasClass("is-expanded") ? t.addClass("is-collapsed").removeClass("is-expanded") : t.removeClass("is-collapsed").addClass("is-expanded"), !1
        }), $(document).on("click", ".js-toggle-range-editor-cross-repo", function() {
            return $(this).closest(".js-range-editor").addClass("is-cross-repo"), !1
        }), $(document).on("pjax:click", ".js-range-editor", function(t, e) {
            $(".js-compare-pr").hasClass("open") && !e.url.match(/expand=1/) && (null == e.data && (e.data = {}), e.data.expand = "1")
        }), $(document).on("navigation:open", "form.js-commitish-form", function() {
            var t, e;
            return e = $(this).find(".js-new-item-name").text(), t = $("<input>", {
                type: "hidden",
                name: "new_compare_ref",
                value: e
            }), $(this).append(t), this.submit()
        })
    }.call(this),
    function() {
        $(function() {
            return $(".js-contact-javascript-flag").val("true")
        })
    }.call(this),
    function() {
        var t;
        t = function(t) {
            var e, n, i, s, a, r;
            for (t = t.toLowerCase(), e = $(".js-csv-data tbody tr"), r = [], s = 0, a = e.length; a > s; s++) n = e[s], i = $(n).text().toLowerCase(), r.push(-1 === i.indexOf(t) ? $(n).hide() : $(n).show());
            return r
        }, $(document).on("keyup", ".js-csv-filter-field", function(e) {
            var n;
            return n = e.target.value, null != n && t(n), !1
        })
    }.call(this),
    function() {
        $(document).on("ajaxSuccess", ".js-comment-resolve-form", function(t, e, n, i) {
            return $(this).closest(".js-comment").replaceWith(i)
        })
    }.call(this),
    function() {
        var t, e, n;
        $.hashChange(function() {
            var t;
            return t = window.location.hash, e(t, !0)
        }), e = function(i, s) {
            var a, r, o, c, l, u, d, h, f;
            return null == s && (s = !1), i && (u = n(i)) && (f = u[0], a = u[1], d = u[2], l = u[3], !document.getElementById(i.slice(1)) && (c = $(document.getElementsByName(a)).next()[0]) && (o = t(c, d, l))) ? ($(o).parents(".js-details-container").addClass("open"), h = o.getAttribute("data-url"), r = {
                anchor: a
            }, $.ajax({
                url: h,
                data: r
            }).then(function(t) {
                var n, a, r, c, l, u;
                if (n = $(o).closest(".js-expandable-line"), a = n.next(".file-diff-line"), a.preservingScrollPosition(function() {
                        return n.replaceWith(t)
                    }), c = document.getElementById(i.slice(1))) {
                    if (u = $(c).overflowOffset(), l = u.top, r = u.bottom, 0 > l || 0 > r) return c.scrollIntoView()
                } else if (s) return e(i)
            })) : void 0
        }, n = function(t) {
            var e, n;
            return e = t.match(/\#(diff\-[a-f0-9]+)([L|R])(\d+)$/i), null != e && 4 === e.length ? e : (n = t.match(/\#(discussion\-diff\-[0-9]+)([L|R])(\d+)$/i), null != n && 4 === n.length ? n : null)
        }, t = function(t, e, n) {
            var i, s, a, r, o, c, l, u;
            for (n = parseInt(n, 10), l = $(t).find(".js-expand"), o = 0, c = l.length; c > o; o++)
                if (s = l[o], i = "R" === e ? "data-right-range" : "data-left-range", u = s.getAttribute(i).split("-"), r = u[0], a = u[1], parseInt(r, 10) <= n && n <= parseInt(a, 10)) return s;
            return null
        }
    }.call(this),
    function() {
        var t, e, n, i, s, a, r, o;
        $(document).on("click", ".js-add-single-line-comment", function() {
            var t, e, i, s, o, c;
            n($(this).closest(".file")[0]), o = this.getAttribute("data-path"), t = this.getAttribute("data-anchor"), c = this.getAttribute("data-position"), e = this.getAttribute("data-line"), s = r($(this).closest("tr")[0], {
                path: o,
                anchor: t,
                position: c,
                line: e
            }), i = $(s).find(".js-line-comments")[0], a(i)
        }), $(document).on("click", ".js-add-split-line-comment", function() {
            var t, e, s, r, c, l, u;
            n($(this).closest(".file")[0]), u = this.getAttribute("data-type"), c = this.getAttribute("data-path"), t = this.getAttribute("data-anchor"), l = this.getAttribute("data-position"), e = this.getAttribute("data-line"), r = o($(this).closest("tr")[0]), s = i(r, "js-" + u, {
                type: u,
                anchor: t,
                path: c,
                position: l,
                line: e
            }), a(s)
        }), $(document).on("click", ".js-toggle-inline-comment-form", function() {
            return a($(this).closest(".js-line-comments")[0]), !1
        }), $(document).on("quote:selection", ".js-line-comments", function() {
            a(this)
        }), $(document).onFocusedKeydown(".js-inline-comment-form .js-comment-field", function() {
            return function(e) {
                return $(this).hasClass("js-navigation-enable") ? void 0 : "esc" === e.hotkey && 0 === this.value.length ? (t($(this).closest(".js-inline-comment-form")[0]), !1) : void 0
            }
        }), $(document).on("click", ".js-hide-inline-comment-form", function() {
            return t($(this).closest(".js-inline-comment-form")[0]), !1
        }), $(document).on("ajaxSuccess", ".js-inline-comment-form", function(e, n, i, s) {
            var a;
            this === e.target && (a = $(this).closest(".js-line-comments"), a.find(".js-comments-holder").append(s), t(this))
        }), $(document).on("session:resume", function(t) {
            var e;
            (e = t.targetId.match(/^new_inline_comment_(diff-\w+)_(\d+)$/)) && $(".js-add-line-comment[data-anchor=" + e[1] + "][data-position=" + e[2] + "]").click()
        }), a = function(t) {
            return $(t).find(".inline-comment-form-container").addClass("open"), $(t).find(".js-write-tab").click(), $(t).find(".js-comment-field").focus()
        }, t = function(t) {
            return t.reset(), $(t).closest(".inline-comment-form-container").removeClass("open"), e()
        }, n = function(t) {
            return $(t).find(".js-toggle-file-notes").prop("checked", !0).trigger("change")
        }, e = function() {
            var t, e, n, i, s, a;
            for (a = $(".file .js-inline-comments-container"), i = 0, s = a.length; s > i; i++) t = a[i], n = $(t).find(".js-comments-holder > *").length > 0, e = $(t).find(".inline-comment-form-container").hasClass("open"), n || e || $(t).remove()
        }, $.observe(".js-comment", {
            remove: e
        }), r = function(t, e) {
            var n, i, a;
            return null == e && (e = {}), (a = $(t).next(".js-inline-comments-container")[0]) ? a : (n = $("#js-inline-comments-single-container-template"), a = n.children().first().clone()[0], i = a.querySelector(".js-inline-comment-form"), s(i, e), i.querySelector(".js-comment-field").id = "new_inline_comment_" + e.anchor + "_" + e.position, $(t).after(a), a)
        }, i = function(t, e, n) {
            var i, a, r;
            return null == n && (n = {}), (r = $(t).find(".js-line-comments." + e)[0]) ? r : (r = $("#js-inline-comments-split-form-container-template").clone().children()[0], $(r).addClass(e), a = $(r).find(".js-inline-comment-form")[0], s(a, n), a.querySelector(".js-comment-field").id = "new_inline_comment_" + n.anchor + "_" + n.position, i = $(t).find("." + e), i.last().after(r), i.remove(), r)
        }, o = function(t) {
            var e;
            return (e = $(t).next(".js-inline-comments-container")[0]) ? e : (e = $("#js-inline-comments-split-container-template").clone().children()[0], $(t).after(e), e)
        }, s = function(t, e) {
            var n, i, s, a;
            for (a = t.elements, i = 0, s = a.length; s > i; i++) n = a[i], n.name in e && (n.value = e[n.name])
        }
    }.call(this),
    function() {
        var t;
        (t = function(t, e, n) {
            return $.observe(t, function(t) {
                var i, s, a, r, o, c;
                return c = null, s = a = function() {
                    c && n(c, !1), c = null
                }, r = function(t) {
                    c && n(c, !1), c = $(t.target).closest(e)[0], c && n(c, !0)
                }, i = function() {
                    return t.addEventListener("mouseenter", s), t.addEventListener("mouseleave", a), t.addEventListener("mouseover", r)
                }, o = function() {
                    return t.removeEventListener("mouseenter", s), t.removeEventListener("mouseleave", a), t.removeEventListener("mouseover", r)
                }, {
                    add: i,
                    remove: o
                }
            })
        })(".diff-table", "td.blob-code, td.blob-num", function(t, e) {
            var n;
            return n = $(t).siblings(), 3 === n.length && (n = $(t).siblings($(t).hasClass("base") ? ".base" : ".head")), n.add(t).toggleClass("is-hovered", e)
        })
    }.call(this),
    function() {
        var t;
        $(document).on("click", ".js-linkable-line-number", function() {
            return window.location.hash = this.id, !1
        }), t = null, $.hashChange(function() {
            var e, n;
            n = document.querySelector(":target"), t && t.removeClass("selected-line"), n && n.classList.contains("js-linkable-line-number") && (e = $(n).siblings(), 3 === e.length && (e = $(n).siblings($(n).hasClass("base") ? ".base" : ".head")), t = e.add(n), t.addClass("selected-line"))
        })
    }.call(this),
    function() {
        var t;
        t = function() {
            var t;
            return t = "split" === $("meta[name=diff-view]").prop("content") && $(".file-diff-split").is(":visible"), document.body.classList.toggle("split-diff", t)
        }, $.observe("meta[name=diff-view]", {
            add: t,
            remove: t
        }), $.observe(".file-diff-split", {
            add: t,
            remove: t
        }), $.observe(".js-pull-request-tab.selected", {
            add: t,
            remove: t
        }), $.observe(".js-compare-tabs .tabnav-tab.selected", {
            add: t,
            remove: t
        })
    }.call(this),
    function() {
        $(document).on("change", ".js-toggle-file-notes", function() {
            return $(this).closest(".file").toggleClass("show-inline-notes", this.checked)
        }), $(document).on("click", ".js-toggle-all-file-notes", function() {
            var t, e;
            return t = $(".js-toggle-file-notes"), e = 0 === t.filter(":checked").length, t.prop("checked", e).trigger("change"), !1
        }), $.observe(".js-inline-comments-container", function() {
            var t, e, n;
            return (e = $(this).closest(".file")[0]) ? (t = n = function() {
                var t;
                t = null != e.querySelector(".js-inline-comments-container"), e.classList.toggle("has-inline-notes", t)
            }, {
                add: t,
                remove: n
            }) : void 0
        })
    }.call(this),
    function() {
        $(document).on("focusin", ".js-url-field", function() {
            var t;
            return t = this, setTimeout(function() {
                return $(t).select()
            }, 0)
        })
    }.call(this),
    function() {
        $(document).on("click", ".js-events-pagination", function() {
            var t, e;
            return e = $(this).parent(".ajax_paginate"), t = e.parent(), e.hasClass("loading") ? !1 : (e.addClass("loading"), $.ajax({
                url: $(this).attr("href"),
                complete: function() {
                    return e.removeClass("loading")
                },
                success: function(t) {
                    return e.replaceWith(t)
                }
            }), !1)
        })
    }.call(this),
    function() {
        $(function() {
            var t, e;
            return t = $(".js-newsletter-frequency-choice"), t.length ? (e = function() {
                var e;
                return t.find(".selected").removeClass("selected"), e = t.find("input[type=radio]:enabled:checked"), e.closest(".choice").addClass("selected")
            }, t.on("change", "input[type=radio]", function() {
                return e()
            }), e()) : void 0
        }), $(document).on("ajaxSuccess", ".js-subscription-toggle", function() {
            var t;
            return t = $(this).find(".selected .notice"), t.addClass("visible"), setTimeout(function() {
                return t.removeClass("visible")
            }, 2e3)
        }), $(document).on("ajaxSuccess", ".js-explore-newsletter-subscription-container", function(t, e) {
            return $(this).replaceWith(e.responseText)
        })
    }.call(this),
    function() {
        var t, e;
        t = function() {
            var t;
            return t = $("#js-features-branch-diagram"), t.removeClass("preload"), t.find("path").each(function() {
                var t, e, n;
                return $(this).is("#js-branch-diagram-branch") ? n = "stroke-dashoffset 3.5s linear 0.25s" : $(this).is("#js-branch-diagram-master") ? n = "stroke-dashoffset 4.1s linear 0s" : $(this).is("#js-branch-diagram-arrow") && (n = "stroke-dashoffset 0.2s linear 4.3s"), e = $(this).get(0), t = e.getTotalLength(), e.style.transition = e.style.WebkitTransition = "none", e.style.strokeDasharray = t + " " + t, e.style.strokeDashoffset = t, e.getBoundingClientRect(), e.style.transition = e.style.WebkitTransition = n, e.style.strokeDashoffset = "0"
            })
        }, $(document).on("click", ".js-segmented-nav-button", function(t) {
            var e, n;
            return n = $(this).data("selected-tab"), e = $(this).closest(".js-segmented-nav"), e.find("li").removeClass("active"), e.siblings(".js-selected-nav-tab").removeClass("active"), $(this).parent().addClass("active"), $("." + n).addClass("active"), t.preventDefault()
        }), e = function() {
            return $(document).scrollTop() >= $("#js-features-branch-diagram").offset().top - 700 ? t() : void 0
        }, $.observe("#js-features-branch-diagram.preload", {
            add: function() {
                return $(window).on("scroll", e)
            },
            remove: function() {
                return $(window).off("scroll", e)
            }
        })
    }.call(this),
    function() {
        $(function() {
            var t;
            return $(document).on("click", ".js-survey-option", function(t) {
                var e, n, i, s, a, r, o;
                return t.preventDefault(), t.stopPropagation(), n = $("#first-run-questions"), n.find("> *").addClass("hidden"), n.find(".js-first-run-spinner").removeClass("hidden"), i = $(this).parents("form"), o = i.attr("action"), a = $(this).attr("data-question-id"), e = $(this).attr("data-choice-id"), r = i.attr("data-source-id"), s = i.find(".js-other-text").val(), $.ajax({
                    type: "PUT",
                    url: o,
                    data: {
                        choice_id: e,
                        question_id: a,
                        survey_id: r,
                        other_text: s
                    },
                    success: function(t) {
                        return n.html(t)
                    },
                    error: function() {
                        return alert("There was an error submitting your response.")
                    }
                })
            }), $(document).on("click", ".js-ignore-experiment", function(t) {
                var e;
                return t.preventDefault(), t.stopPropagation(), e = $(this).attr("data-ref"), console.log("experiment_id", e), $.ajax({
                    type: "PUT",
                    url: "/ignore-survey",
                    data: {
                        experiment_id: e
                    },
                    success: function() {
                        return window.location.href = "/"
                    },
                    error: function() {
                        return alert("There was an error submitting your response.")
                    }
                })
            }), t = function(t) {
                var e;
                t = $(t), e = t.val(), e.length > 0 ? t.next(".js-other-submit").prop("disabled", !1) : t.next(".js-other-submit").prop("disabled", !0)
            }, $(document).onFocusedInput("input.js-other-text", function(e) {
                return $(this).on("throttled:input." + e, function() {
                    return t(this)
                }), !1
            })
        })
    }.call(this),
    function() {
        $(document).on("click", ".js-fork-owner-select-target", function() {
            var t;
            if (!$(this).hasClass("disabled")) return t = $(this).text().replace("@", ""), $("#organization").val(t), $("#fork").submit()
        })
    }.call(this),
    function() {
        var t, e, n, i;
        t = function() {
            return $(".js-code-textarea").val().trim().length > 0
        }, i = function() {
            return $(".js-remove-gist-file").length <= 1 ? $(".js-remove-gist-file").hide() : $(".js-remove-gist-file").show()
        }, $(document).on("change", ".js-code-textarea", function() {
            return $(".js-gist-create").prop("disabled", !t())
        }), $(document).on("throttled:input", ".js-gist-filename", function() {
            var t, e, n;
            return t = $(this), n = t.val(), e = t.parents(".js-code-editor").data("code-editor"), $.ajax({
                url: t.attr("data-language-detection-url"),
                method: "POST",
                data: {
                    filename: n
                },
                dataType: "json"
            }).done(function(n) {
                return (null != n ? n.language : void 0) ? (e.setMode(n.language), t.parents(".meta").find(".js-gist-file-language").text(n.message)) : void 0
            })
        }), n = $("#js-gist-file-template"), $(document).on("click", ".js-add-gist-file", function() {
            var t, e;
            return t = $(".js-gist-files"), e = $($("#js-gist-file-template").html()), t.append(e), $(document).scrollTop(e.offset().top - 100), i()
        }), $(document).on("click", ".js-remove-gist-file", function() {
            var t;
            return t = $(this).closest(".js-gist-file"), t.find(".js-gist-deleted input").removeAttr("disabled"), t.find(".js-code-editor").remove(), i(), $(".js-gist-file").length || $(".js-gist-files").append($("#js-gist-file-template").html()), !1
        }), $(document).on("click", ".js-delete-button", function(t) {
            return confirm("Are you positive you want to delete this Gist?") ? void 0 : t.preventDefault()
        }), $(document).on("click", ".js-gist-visibility-toggle", function() {
            return $(this).find("input").prop("checked", !0), $(".js-gist-visibility-toggle").removeClass("active"), $(this).closest(".js-gist-visibility-toggle").addClass("active"), e($(this).data("visibility-type"))
        }), e = function(t) {
            return $(".js-gist-create").text("Create " + t + " Gist"), $(".js-gist-update").text("Update " + t + " Gist")
        }, $(function() {
            return i()
        })
    }.call(this),
    function() {
        var t, e;
        t = {
            isHttpFragment: function(t) {
                return 0 === "http://".indexOf(t) || 0 === "https://".indexOf(t)
            },
            isValidHttpUrl: function(t) {
                var e, n, i, s;
                return s = function() {
                    try {
                        return new URL(t)
                    } catch (n) {
                        return e = n, null
                    }
                }(), null == s ? !1 : (n = /^https?/.test(s.protocol), i = s.href === t || s.href === "" + t + "/", n && i)
            }
        }, $.observe(".js-hook-url-field", function(e) {
            var n, i, s;
            n = $(e), i = function(t) {
                var e, n;
                return e = $(t).closest("form"), n = /^https:\/\/.+/.test(t.val()), e.toggleClass("is-ssl", n)
            }, s = function(e) {
                var n, i;
                return n = e.val(), i = t.isHttpFragment(n) || t.isValidHttpUrl(n), e.closest("form").toggleClass("is-invalid-url", !i)
            }, n.on("keyup", function() {
                return i(n)
            }), n.on("throttled:input", function() {
                return s(n)
            }), i(n), s(n)
        }), $(document).on("click", ".js-hook-toggle-ssl-verification", function(t) {
            return t.preventDefault(), $(".js-ssl-hook-fields").toggleClass("is-not-verifying-ssl"), $(".js-ssl-hook-fields").hasClass("is-not-verifying-ssl") ? ($(".js-hook-ssl-verification-field").val("1"), $(document).trigger("close.facebox")) : $(".js-hook-ssl-verification-field").val("0")
        }), e = function(t) {
            var e;
            return console.log("chooseEvents", t), e = $(".js-hook-event-checkbox"), e.prop("checked", !1), null != t ? e.filter(t).prop("checked", !0) : void 0
        }, $(document).on("change", ".js-hook-event-choice", function() {
            var t;
            return t = "custom" === $(this).val(), $(".js-hook-events-field").toggleClass("is-custom", t), !0
        }), $(document).on("submit", ".js-hook-form", function() {
            var t, n;
            return t = $(this), n = t.find(".js-hook-event-choice:checked").val(), "custom" === n && $(".js-hook-wildcard-event").prop("checked", !1), "push" === n && e('[value="push"]'), "all" === n && e(".js-hook-wildcard-event"), !0
        }), $(document).on("details:toggle", ".js-hook-delivery-item", function() {
            var t, e, n;
            return e = $(this), e.data("details-load-initiated") ? void 0 : (e.data("details-load-initiated", !0), t = e.find(".js-hook-delivery-details"), t.addClass("is-loading"), n = $.get(t.data("url")), n.done(function(e) {
                return t.replaceContent(e)
            }), n.fail(function() {
                return t.addClass("has-error")
            }), n.always(function() {
                return t.removeClass("is-loading")
            }))
        }), $(document).on("click", ".js-hook-delivery-details .js-tabnav-tab", function() {
            var t, e, n;
            return e = $(this), t = e.closest(".js-hook-delivery-details"), t.find(".js-tabnav-tab").removeClass("selected"), n = t.find(".js-tabnav-tabcontent").removeClass("selected"), e.addClass("selected"), n.filter("[data-tab-name=" + e.data("tab-target") + "]").addClass("selected")
        }), $(document).on("click", ".js-hook-deliveries-pagination-button", function(t) {
            var e, n, i;
            return t.preventDefault(), e = $(this), n = e.parent().addClass("loading"), i = $.get(e.attr("href")), i.done(function(t) {
                return n.replaceWith(t)
            })
        }), $(document).on("click", ".js-redeliver-hook-delivery-button", function(t) {
            var e, n, i, s;
            return t.preventDefault(), e = $(this), e.hasClass("disabled") ? void 0 : (e.addClass("disabled"), i = e.data("delivery-guid"), n = $('.js-hook-delivery-details[data-delivery-guid="' + i + '"]'), console.log(i, n), s = $.post(e.attr("href")), s.fail(function() {
                return e.siblings(".js-redelivery-dialog").addClass("failed")
            }), s.done(function(t) {
                return $(document).trigger("close.facebox"), n.replaceWith(t)
            }))
        }), $(document).on("deferredcontent:loaded", ".js-hook-delivery-details", function() {
            var t, e;
            return t = $(this), e = t.closest(".js-hook-delivery-item"), e.find(".js-item-status").removeClass("success pending failure").addClass(t.data("status-class")), e.find(".js-item-status-tooltip").attr("aria-label", t.data("status-message"))
        }), $(document).on("click", ".js-test-hook-button", function(t) {
            var e, n, i;
            return e = $(this), e.hasClass("disabled") ? void 0 : (e.addClass("disabled"), n = $(".js-test-hook-message").removeClass("error success"), i = $.post(e.data("test-hook-url")), i.fail(function(t) {
                var e;
                return e = $.parseJSON(t.responseText), n.addClass("error"), n.find(".js-test-hook-message-errors").text(e.errors)
            }), i.done(function() {
                return n.addClass("success")
            }), i.always(function() {
                return e.removeClass("disabled")
            }), t.preventDefault())
        })
    }.call(this),
    function() {
        var t, e, n;
        t = function(t) {
            var e;
            return null == t && (t = $(this)), e = t.find("a").attr("href"), $(".js-slideshow-nav .active").removeClass("active"), t.addClass("active"), $(".js-integrations-slide-content .active").removeClass("active"), $(e).addClass("active"), !1
        }, e = function() {
            var e, n;
            return e = $(".js-slideshow-nav .active"), n = 0 === e.next().length, t(n ? $(".js-slide-tab").eq(0) : e.next())
        }, n = null, $.observe(".js-slideshow-nav", {
            add: function() {
                return n = setInterval(e, 9e3)
            },
            remove: function() {
                return clearInterval(n)
            }
        }), $(document).on("click", ".js-slide-tab a", function() {
            return t($(this).closest(".js-slide-tab")), clearInterval(n), !1
        })
    }.call(this),
    function() {
        $(document).on("navigation:open", ".js-issues-custom-filter", function() {
            var t, e, n;
            return n = $(this).find(".js-new-item-name").text(), e = $(this).attr("data-name"), t = $("<input>", {
                type: "hidden",
                name: e,
                value: n
            }), $(this).append(t), this.submit()
        })
    }.call(this),
    function() {
        var t, e, n;
        e = function(e, n) {
            return e.closest(".js-label-editor").find(".js-color-editor-bg").css("background-color", n), e.css("color", t(n, -.5)), e.css("border-color", n)
        }, n = function(t) {
            var e, n;
            return e = "#c00", n = $(t).closest(".js-color-editor"), n.find(".js-color-editor-bg").css("background-color", e), t.css("color", "#c00"), t.css("border-color", e)
        }, t = function(t, e) {
            var n, i, s;
            for (t = String(t).toLowerCase().replace(/[^0-9a-f]/g, ""), t.length < 6 && (t = t[0] + t[0] + t[1] + t[1] + t[2] + t[2]), e = e || 0, s = "#", n = void 0, i = 0; 3 > i;) n = parseInt(t.substr(2 * i, 2), 16), n = Math.round(Math.min(Math.max(0, n + n * e), 255)).toString(16), s += ("00" + n).substr(n.length), i++;
            return s
        }, $(document).on("focusin", ".js-color-editor-input", function() {
            var t, i;
            return i = $(this), t = $(this).closest(".js-label-editor"), i.on("throttled:input.colorEditor", function() {
                var s;
                return "#" !== i.val().charAt(0) && i.val("#" + i.val()), t.removeClass("is-valid is-not-valid"), s = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(i.val()), s ? (t.addClass("is-valid"), e(i, i.val())) : (t.addClass("is-not-valid"), n(i))
            }), i.on("blur.colorEditor", function() {
                return i.off(".colorEditor")
            })
        }), $(document).on("mousedown", ".js-color-chooser-color", function() {
            var t, n, i;
            return $(this).closest(".js-color-editor").removeClass("open"), t = $(this).closest(".js-label-editor"), n = "#" + $(this).data("hex-color"), i = t.find(".js-color-editor-input"), t.removeClass("is-valid is-not-valid"), i.val(n), e(i, n)
        }), $(document).on("submit", ".js-label-editor form", function() {
            var t, e;
            return t = $(this).find(".js-color-editor-input"), e = t.val(), e.length < 6 && (e = e[1] + e[1] + e[2] + e[2] + e[3] + e[3]), t.val(e.replace("#", ""))
        }), $(document).on("focusin", ".js-label-editor", function() {
            return $(this).closest(".js-label-editor").addClass("open")
        }), $(document).on("reset", ".js-create-label", function() {
            return setImmediate(function(t) {
                return function() {
                    var n;
                    return n = $(t).find(".js-color-editor-input"), e(n, n.val())
                }
            }(this))
        })
    }.call(this),
    function() {
        $(document).on("click", ".js-edit-label", function() {
            return $(this).closest(".labels-list-item").addClass("edit")
        }), $(document).on("click", ".js-edit-label-cancel", function() {
            return this.form.reset(), $(this).closest(".labels-list-item").removeClass("edit")
        }), $(document).on("ajaxSuccess", ".js-create-label", function(t, e, n, i) {
            return this.reset(), $(this).nextAll(".table-list").prepend(i), $(".blankslate").hide()
        }), $(document).on("ajaxSuccess", ".js-update-label", function(t, e, n, i) {
            return $(this).closest(".labels-list-item").replaceWith(i)
        }), $(document).on("ajaxSend", ".js-update-label, .js-create-label", function() {
            return $(this).find(".error").text("")
        }), $(document).on("ajaxError", ".js-update-label, .js-create-label", function(t, e) {
            return $(this).find(".error").text(e.responseText), !1
        }), $(document).on("ajaxSuccess", ".js-delete-label", function() {
            return $(this).closest(".labels-list-item").fadeOut()
        })
    }.call(this),
    function() {
        $.hashChange(function(t) {
            var e, n, i, s;
            return i = t.newURL, (n = i.match(/\/issues#issue\/(\d+)$/)) ? (s = n[0], e = n[1], window.location = i.replace(/\/?#issue\/.+/, "/" + e)) : void 0
        }), $.hashChange(function(t) {
            var e, n, i, s, a;
            return s = t.newURL, (i = s.match(/\/issues#issue\/(\d+)\/comment\/(\d+)$/)) ? (a = i[0], n = i[1], e = i[2], window.location = s.replace(/\/?#issue\/.+/, "/" + n + "#issuecomment-" + e)) : void 0
        })
    }.call(this),
    function() {
        var t;
        $.observe(".js-issues-list-check:checked", {
            add: function() {
                return $(this).closest(".js-issue-row").addClass("selected")
            },
            remove: function() {
                return $(this).closest(".js-issue-row").removeClass("selected")
            }
        }), $(document).on("navigation:keydown", ".js-issue-row", function(e) {
            return "x" === e.hotkey ? (t(this), !1) : void 0
        }), $("#js-issues-search").focus(function() {
            return this.value = this.value
        }), t = function(t) {
            var e;
            (e = $(t).find(".js-issues-list-check")[0]) && (e.checked = !e.checked, $(e).trigger("change"))
        }
    }.call(this),
    function() {
        $(document).on("click", ".js-new-issue-form .js-composer-label", function() {
            var t;
            return t = $(this).find("input[type=checkbox]")[0], t.checked = !t.checked, this.classList.toggle("selected", t.checked), !1
        })
    }.call(this),
    function() {
        var t;
        $(document).on("selectmenu:selected", ".js-composer-assignee-picker .js-navigation-item", function() {
                var t, e, n;
                return t = $(this).closest(".js-infobar"), e = $(this).find("input[type=radio]").val(), n = $(this).hasClass("js-clear-assignee"), t.find(".js-composer-assignee-picker").toggleClass("is-showing-clear-item", !n), t.find(".js-assignee-infobar-item-wrapper").empty().append(function() {
                    var t, i;
                    return n ? "No one will be assigned" : (i = $("<a>", {
                        href: "/" + e,
                        "class": "css-truncate-target",
                        text: e
                    }), t = $("<span>", {
                        text: " will be assigned"
                    }), [i, t])
                })
            }), $(document).on("selectmenu:selected", ".js-assignee-picker .js-navigation-item", function() {
                var e;
                return e = $(this).closest("form"), t(e, {}, function(t) {
                    return function() {
                        var e, n;
                        return e = $(t).closest(".js-assignee-picker"), n = $(t).hasClass("js-clear-assignee"), e.toggleClass("is-showing-clear-item", !n), $(".js-assignee-infobar-item-wrapper").empty().append(function() {
                            var e, i, s;
                            return n ? "No one assigned" : (s = $(t).find("input[type=radio]").val(), e = $(t).find(".js-select-menu-item-gravatar").html(), i = $("<a>", {
                                href: "/" + s,
                                "class": "assignee css-truncate-target",
                                text: s
                            }), [e, i])
                        })
                    }
                }(this))
            }), $(document).on("selectmenu:selected", ".js-composer-milestone-picker .js-navigation-item", function() {
                var t, e, n, i, s;
                return t = $(this).closest(".js-infobar"), i = $(this).find("input[type=radio]"), e = t.find('input[name="issue[milestone_id]"]'), n = t.find('input[name="new_milestone_title"]'), $(this).hasClass("js-new-item-form") ? (e.val("new"), n.val($(this).find(".js-new-item-name").text())) : e.val(i[0].value), s = $(this).hasClass("js-clear-milestone"), t.find(".js-composer-milestone-picker").toggleClass("is-showing-clear-item", !s), $(".js-composer-milestone-title").empty().append(function(t) {
                    return function() {
                        var e;
                        return s ? "No milestone" : (e = $(t).find(".js-milestone-title").html(), $("<strong>", {
                            "class": "css-truncate-target"
                        }).append(e))
                    }
                }(this))
            }), $(document).on("selectmenu:selected", ".js-milestone-picker .js-navigation-item", function() {
                var e;
                return e = $(this).closest("form"), t(e, {}, function(t) {
                    return function(e) {
                        var n, i, s;
                        return i = $(t).closest(".js-milestone-picker"), s = $(t).hasClass("js-clear-milestone"), i.toggleClass("is-showing-clear-item", !s), n = $(".js-milestone-infobar-item-wrapper"), n.length ? (n.html(e.infobar_body), i.menu("deactivate"), i.find(".js-milestone-picker-body").html(e.select_menu_body)) : void 0
                    }
                }(this))
            }), $(document).on("click", ".js-apply-labels", function() {
                var e;
                return e = $(this).closest("form"), t(e, {
                    type: "put"
                }, function(t) {
                    return function() {
                        return $(t).menu("deactivate")
                    }
                }(this)), !1
            }), $(document).on("click", ".js-remove-labels", function() {
                var e;
                return e = $(this).closest("form"), t(e, {
                    type: "delete"
                }, function(t) {
                    return function() {
                        return $(t).menu("deactivate")
                    }
                }(this)), !1
            }), $(document).on("selectmenu:selected", ".js-issue-show-label-select-menu .js-navigation-item", function() {
                var e, n, i;
                return e = $(this).closest("form"), n = $(this).find("input[type=checkbox]"), i = {
                        type: n.is(":checked") ? "put" : "delete",
                        data: {
                            "issueId": e.find(".js-issue-number").val(),
                            "labels[]": n.val()
                        }
                    },
                    t(e, i, function(t) {
                        return $(".discussion-labels > .color-label-list, .js-timeline-label-list").html(t.labels)
                    }), !1
            }),
            t = function(t, e, n) {
                var i;
                console.log(n);
                if (i = t[0]) return $.ajax({
                    context: i,
                    type: e.type || t.attr("method"),
                    url: t.attr("action"),
                    data: e.data || t.serialize(),
                    success: n
                })
            }
    }.call(this),
    function() {
        $(document).on("ajaxSuccess", ".js-issue-quick-assign", function() {
            var t;
            t = $(this).closest(".js-assignee-infobar-item-wrapper"), t.find(".js-issue-self-assigned").show().siblings().remove()
        })
    }.call(this),
    function() {
        $(document).on("change", ".js-issues-list-check", function() {
            $("#js-issues-toolbar").toggleClass("triage-mode", $(".js-issues-list-check:checked").length > 0)
        }), $(document).on("change", ".js-issues-list-check, .js-issues-triage-select-entire-search-field", function() {
            var t, e, n;
            n = $("#js-issues-toolbar .js-issues-triage-select-entire-search-field").prop("checked"), n ? (e = $("#js-issues-search").val(), $("#js-issues-toolbar .js-issues-toolbar-triage .js-select-menu").data("contents-data", {
                issues: e
            }).addClass("js-load-contents")) : (t = $(".js-issues-list-check:checked"), $("#js-issues-toolbar .js-issues-toolbar-triage .js-select-menu").data("contents-data", t).addClass("js-load-contents"))
        }), $(document).on("change", "#js-issues-toolbar .js-check-all", function() {
            var t;
            return t = $("#js-issues-toolbar .js-issues-triage-select-entire-search"), t.toggle(this.checked), this.checked ? void 0 : t.find(".js-issues-triage-select-entire-search-field").prop("checked", !1).change()
        }), $(document).on("selectmenu:selected", ".js-issues-toolbar-triage .js-navigation-item", function() {
            var t, e, n, i, s, a;
            n = $(this).closest(".js-menu-container").hasClass("js-label-select-menu"), t = $(this).closest("form"), s = $(this).hasClass("selected"), i = $(this).attr("data-name"), a = $(this).attr("data-value"), e = n ? $("<input>", {
                type: "hidden",
                name: "" + i + "[" + a + "]",
                value: s ? "1" : "0"
            }) : $("<input>", {
                type: "hidden",
                name: i,
                value: s ? a : ""
            }), setImmediate(function(t) {
                return function() {
                    return $(t).menu("deactivate")
                }
            }(this)), t.find(".js-issues-triage-fields").append(e), t.addClass("js-submit")
        }), $(document).on("menu:deactivate", ".js-issues-toolbar-triage .js-menu-container", function(t) {
            var e, n;
            e = $(this).find("form.js-submit"), e[0] && ($(this).addClass("is-loading"), n = $.ajax({
                type: e.attr("method"),
                url: e.prop("action"),
                data: e.serializeArray()
            }), Promise.resolve(n).then(function(t) {
                return function(e) {
                    var n, i, s;
                    return s = Promise.resolve($.ajaxPoll({
                        url: e.job.url
                    })), n = function() {
                        return $(t).menu("deactivate"), location.reload()
                    }, i = function() {
                        return $(t).addClass("has-error")
                    }, s.then(n, i)
                }
            }(this)), e.removeClass("js-submit"), t.preventDefault())
        })
    }.call(this),
    function() {
        var t;
        t = function() {
            var t;
            return t = {
                div: "#keyboard_shortcuts_pane",
                ajax: "/site/keyboard_shortcuts?url=" + window.location.pathname
            }, $.facebox(t, "shortcuts")
        }, $(document).on("click", ".js-keyboard-shortcuts", function() {
            return t(), !1
        }), $(document).on("click", ".js-see-all-keyboard-shortcuts", function() {
            return $(this).remove(), $(".facebox .js-hidden-pane").css("display", "table-row-group"), !1
        }), $(document).on("keypress", function(e) {
            return e.target === document.body && 63 === e.which ? ($(".facebox").is($.visible) ? $.facebox.close() : t(), !1) : void 0
        })
    }.call(this),
    function() {
        $.observe("input.js-date-input", function() {
            $(this).next(".date_selector").remove(), new DateInput(this)
        }), $(document).on("click", ".js-date-input-clear", function() {
            return $("input.js-date-input").data("datePicker").resetDate(), !1
        })
    }.call(this),
    function() {
        var t, e;
        t = function(t) {
            return $(t).is(".read") ? void 0 : $(t).toggleClass("unread read")
        }, e = function(t) {
            return $(t).is(".unread") ? void 0 : $(t).toggleClass("unread read")
        }, $(document).on("click", ".js-notification-target", function(e) {
            return e.which > 1 ? void 0 : t($(this).closest(".js-notification"))
        }), $(document).on("ajaxSuccess", ".js-delete-notification", function() {
            return t($(this).closest(".js-notification"))
        }), $(document).on("ajaxSuccess", ".is-preview-features .js-undo-notification", function() {
            return e($(this).closest(".js-notification"))
        }), $(document).on("ajaxSuccess", ".js-mute-notification", function() {
            var e;
            return t($(this).closest(".js-notification")), e = $(this).closest(".js-notification"), this.action = e.is(".muted") ? this.action.replace("unmute", "mute") : this.action.replace("mute", "unmute"), e.toggleClass("muted")
        }), $(document).on("ajaxSuccess", ".js-mark-visible-as-read", function() {
            var t;
            return t = $(this).closest(".js-notifications-browser"), t.find(".unread").toggleClass("unread read"), t.find(".js-mark-visible-as-read").addClass("mark-all-as-read-confirmed"), t.find(".js-mark-as-read-confirmation").addClass("mark-all-as-read-confirmed")
        }), $(document).on("ajaxSuccess", ".js-mark-remaining-as-read", function() {
            var t;
            return t = $(this).closest(".js-notifications-browser"), t.find(".js-mark-remaining-as-read").hide(), t.find(".js-mark-remaining-as-read-confirmation").show()
        }), $(document).on("navigation:keydown", ".js-notification", function(t) {
            switch (t.hotkey) {
                case "I":
                case "e":
                case "y":
                    return $(this).find(".js-delete-notification").submit(), !1;
                case "U":
                case "meta+U":
                    return $(this).find(".js-undo-notification").submit(), !1;
                case "M":
                case "m":
                    return $(this).find(".js-mute-notification").submit(), !1
            }
        }), $(document).on("navigation:keyopen", ".js-notification", function() {
            return t(this)
        }), $(document).on("ajaxBeforeSend", ".js-notifications-subscription", function() {
            return $(this).find(".js-spinner").show()
        }), $(document).on("ajaxComplete", ".js-notifications-subscription", function() {
            return $(this).find(".js-spinner").hide()
        })
    }.call(this),
    function() {
        $(document).on("click", ".js-oauth-org-access-details .js-tabnav-tab", function(t) {
            var e, n, i;
            return t.preventDefault(), n = $(this), e = n.closest(".js-oauth-org-access-details"), e.find(".js-tabnav-tab").removeClass("selected"), i = e.find(".js-tabnav-tabcontent").addClass("hidden"), e.find(".js-tabnav-tab[data-tab-target=" + n.data("tab-target") + "]").addClass("selected"), i.filter("[data-tab-name=" + n.data("tab-target") + "]").removeClass("hidden")
        })
    }.call(this),
    function() {
        $.observe(".js-organization-renaming", function() {
            var t;
            return t = $.ajaxPoll({
                url: $(this).attr("data-status-path")
            })
        })
    }.call(this),
    function() {
        $(document).on("submit", ".org form[data-results-container]", function() {
            return !1
        })
    }.call(this),
    function() {
        var t, e;
        t = function() {
            return $(".js-invitation-toggle-team:checked").visible()
        }, e = function() {
            var e;
            return $(".js-ldap-notice").length > 0 ? $(".js-invitation-create").removeClass("disabled") : (e = t().length > 0, $(".js-invitation-create").toggleClass("disabled", !e))
        }, $(document).on("click", ".js-invitations-team-suggestions-view-all", function() {
            return $.get(this.href, function(e) {
                return function(n) {
                    var i, s;
                    return s = t().map(function() {
                        return this.value
                    }), i = $(e).closest("ul"), i.html(n), s.each(function() {
                        return i.find(".js-invitation-toggle-team[value=" + this + "]").prop("checked", !0)
                    })
                }
            }(this)), !1
        }), $(document).on("change", ".js-invitation-toggle-team", e), $.observe(".js-invitation-create", e)
    }.call(this),
    function() {
        var t, e, n;
        t = [], e = function() {
            var t, e, n;
            return t = $(".js-person-grid"), e = t.find(".js-org-person").has(".js-org-person-toggle:checked"),
                function() {
                    var t, i, s;
                    for (s = [], t = 0, i = e.length; i > t; t++) n = e[t], s.push($(n).attr("data-id"));
                    return s
                }().sort()
        }, n = null, $(document).on("change", ".js-org-person-toggle", function() {
            var i, s, a, r;
            return i = $(".js-org-toolbar"), s = i.find(".js-member-selected-actions"), a = e(), r = a.length > 0, JSON.stringify(a) !== JSON.stringify(t) ? (t = a, $(".js-member-not-selected-actions").toggleClass("hidden", r), s.toggleClass("hidden", !r), i.addClass("disabled"), null != n && n.abort(), n = $.ajax({
                url: s.attr("data-toolbar-actions-url"),
                data: {
                    member_ids: a
                }
            }), n.done(function(t) {
                return s.html(t)
            }), n.always(function() {
                return i.removeClass("disabled")
            })) : void 0
        }), $(document).on("click", ".js-member-remove-confirm-button", function(t) {
            return t.preventDefault(), $.facebox(function() {
                var n;
                return n = $.ajax({
                    url: $(t.target).attr("data-url"),
                    data: {
                        member_ids: e()
                    }
                }), n.done(function(t) {
                    return $.facebox(t)
                })
            })
        }), $(document).on("click", ".js-member-search-filter", function() {
            var t, e;
            return e = $(this).data("filter"), t = $(".js-member-filter-field"), t.val("" + e + " "), t.focus(), t.trigger("throttled:input"), !1
        })
    }.call(this),
    function() {
        $(document).onFocusedInput(".js-new-organization-name", function() {
            var t;
            return t = $(this).closest("dd").find(".js-field-hint-name"),
                function() {
                    return t.text($(this).val())
                }
        }), $(document).on("click", ".js-org-creation-invitation-cancel", function(t) {
            var e, n;
            return t.preventDefault(), e = $(t.currentTarget), n = e.closest("li"), n.hide(), $.ajax({
                url: e.attr("href"),
                method: "DELETE"
            }).done(function() {
                return n.remove()
            }).fail(function() {
                return n.show(), alert("There was an error canceling the invitation.")
            })
        })
    }.call(this),
    function() {
        $(document).on("click", ".js-repo-search-filter", function() {
            var t, e, n, i, s;
            return e = $(this).data("filter"), n = $(this).data("negate"), t = $(".js-repo-filter-field"), i = t.val(), i.indexOf(n) > -1 && (i = i.replace(n, ""), i = i.replace(/^\s*/, "")), -1 === i.indexOf(e) && (s = i && i.match(/\s$/) ? "" : " ", t.val(i + ("" + s + e + " ")), t.focus(), t.trigger("throttled:input")), $("body").removeClass("menu-active"), !1
        }), $(document).on("keypress", ".js-repository-fallback-search", function(t) {
            var e, n, i, s;
            if (13 === t.which) return e = $(this), n = e.data("host"), i = e.data("org"), s = e.val(), document.location = "http://" + n + "/search?q=user%3A" + i + "+" + s + "&type=Repositories"
        })
    }.call(this),
    function() {
        $(document).on("click", ".js-delete-team-button", function() {
            var t;
            return t = $(this), t.attr("disabled", "disabled"), $.ajax({
                url: t.attr("data-url"),
                type: "delete"
            }), !1
        })
    }.call(this),
    function() {
        $(document).on("ajaxSend", ".js-ldap-import-groups-container", function(t, e) {
            return e.setRequestHeader("X-Context", "import")
        }), $(document).on("autocomplete:autocompleted:changed", ".js-team-ldap-group-field", function() {
            var t;
            return t = $(this).closest(".js-ldap-group-adder").removeClass("is-exists"), t.find(".js-ldap-group-adder-button").toggleClass("disabled", !$(this).attr("data-autocompleted"))
        }), $(document).on("navigation:open", ".js-team-ldap-group-autocomplete-results .js-navigation-item", function() {
            var t, e;
            return t = $(this).closest(".js-ldap-group-adder"), e = $(this).attr("data-dn"), t.find(".js-team-ldap-dn-field").val(e), $(this).closest(".js-ldap-import-groups-container").find(".js-ldap-group-dn").map(function(n, i) {
                $(i).text() === e && (t.addClass("is-exists"), t.find(".js-ldap-group-adder-button").addClass("disabled"))
            })
        }), $(document).on("ajaxBeforeSend", ".js-import-container", function() {
            var t;
            return t = $(this).find(".js-ldap-group-adder-button"), t.hasClass("disabled") ? !1 : ($(this).addClass("is-importing"), t.addClass("disabled"))
        }), $(document).on("ajaxComplete", ".js-import-container", function() {
            return $(this).removeClass("is-importing")
        }), $(document).on("ajaxSuccess", ".js-ldap-group-adder", function(t, e, n, i) {
            return $(this).closest(".js-ldap-import-groups-container").removeClass("is-empty").find(".js-ldap-imported-groups").append($(i)), this.reset(), $(this).find(".js-team-ldap-group-field").focus(), $(this).find(".js-ldap-group-adder-button").addClass("disabled"), $(".js-ldap-finish-button").text("Finish importing teams").addClass("primary")
        }), $(document).on("click", ".js-team-remove-group", function(t) {
            return $(this).hasClass("disabled") ? !1 : (t.preventDefault(), $(this).addClass("disabled").closest(".js-team").addClass("is-removing"), $(".js-team-ldap-group-field").focus())
        }), $(document).on("ajaxSuccess", ".js-team-remove-group", function() {
            return $(this).closest(".js-team").remove(), 0 === $(".js-team:not(.is-removing)").length ? ($(".js-ldap-import-groups-container").addClass("is-empty"), $(".js-ldap-finish-button").text("Skip this step").removeClass("primary")) : void 0
        }), $(document).on("ajaxError", ".js-team-remove-group", function() {
            return $(this).removeClass("disabled").closest(".js-team").removeClass("is-removing")
        }), $(document).on("click", ".js-edit-team", function(t) {
            return $(this).closest(".js-team").hasClass("is-removing") ? !1 : (t.preventDefault(), $(this).closest(".js-team").addClass("is-editing"), $(this).closest(".js-team").find(".js-team-name-field").focus())
        }), $(document).on("click", ".js-save-button", function() {
            return $(this).hasClass("disabled") ? !1 : $(this).closest(".js-team").addClass("is-sending")
        }), $(document).on("change", ".js-team-permission", function() {
            return $(this).closest(".js-team").hasClass("is-editing") ? void 0 : ($(this).closest(".js-team").addClass("is-sending").find(".js-team-form").submit(), $(this).prop("disabled", "disabled"))
        }), $(document).on("click", ".js-cancel-team-edit", function(t) {
            var e, n;
            return t.preventDefault(), n = $(this).closest(".js-team").removeClass("is-editing"), e = n.find(".js-team-form").removeClass("is-exists"), e.find(".js-slug").text(e.find(".js-slug").data("original-slug")), e[0].reset()
        }), $(document).on("ajaxSuccess", ".js-team-form:not(.is-checking)", function(t, e, n, i) {
            return e.nameCheck ? void 0 : $(this).closest(".js-team").removeClass("is-editing").replaceWith($(i))
        }), $(document).on("ajaxSuccess", ".js-team-form.is-checking", function(t, e, n, i) {
            var s, a;
            return s = $(this).removeClass("is-checking"), "function" == typeof(a = s.find(".js-team-name-field")).removeData && a.removeData("autocheck-xhr"), i.error ? (s.find(".js-save-button").addClass("disabled"), "exists" === i.error ? (s.addClass("is-exists"), s.find(".js-slug").html(i.slug)) : void 0) : (s.find(".js-slug").html(i.slug), s.find(".js-save-button").removeClass("disabled"))
        }), $(document).on("ajaxError", ".js-team-form", function(t, e) {
            return e.nameCheck && "abort" === e.statusText ? !1 : void 0
        }), $(document).on("throttled:input", ".js-team-name-field", function() {
            var t, e, n, i;
            return e = $(this), t = e.closest(".js-team-form"), null != (i = e.data("autocheck-xhr")) && i.abort(), t.removeClass("is-exists").addClass("is-checking"), t.find(".js-save-button").addClass("disabled"), n = $.ajax({
                url: e.attr("data-check-url"),
                type: "GET",
                context: this,
                data: {
                    name: this.value
                }
            }), n.nameCheck = !0, e.data("autocheck-xhr", n)
        })
    }.call(this),
    function() {
        $(document).on("click", ".js-show-own-teams", function() {
            var t, e, n, i;
            return t = $(".js-team-search-field"), i = t.val(), n = $(this).attr("data-me"), -1 === i.indexOf("@" + n) && (e = i ? " " : "", t.val("" + i + e + "@" + n), t.focus(), t.trigger("throttled:input")), !1
        })
    }.call(this),
    function() {
        var t;
        t = function(t, e, n) {
            var i, s;
            return t.addClass("is-sending"), i = t.find(".team-name-octicon"), i.attr("class", "hidden octicon team-name-octicon"), s = $.get(e.attr("data-check-url"), {
                name: n
            }), s.done(function(s) {
                var a, r, o, c, l;
                return t.removeClass("is-sending"), t.find(".js-team-name-errors").html(s ? s : ""), o = null != (l = e.attr("data-original")) ? l.trim() : void 0, r = o && n === o, a = !!t.find(".js-error").length, c = (a || !n) && !r, c ? t.find(".js-create-team-button").attr("disabled", "disabled") : t.find(".js-create-team-button").removeAttr("disabled"), a ? i.attr("class", "octicon team-name-octicon octicon-alert") : n ? i.attr("class", "octicon team-name-octicon octicon-check") : void 0
            })
        }, $(document).on("throttled:input", ".js-new-team", function() {
            var e, n;
            return n = $(this), e = n.closest("form"), t(e, n, n.val().trim())
        }), $(document).on("autocomplete:search", ".js-team-ldap-group-field", function() {
            var t, e;
            return e && e.abort(), t = $(this).val().trim(), "" === t ? ($(".js-team-ldap-group-autocomplete-result-list").empty(), void $(".js-team-ldap-group-autocomplete-results").trigger("autocomplete:change")) : e = $.ajax({
                type: "GET",
                data: {
                    query: t
                },
                url: $(this).attr("data-search-url"),
                dataType: "html",
                success: function(t) {
                    return e = null, $(".js-team-ldap-group-autocomplete-result-list").html(t), $(".js-team-ldap-group-autocomplete-results").trigger("autocomplete:change")
                }
            })
        }), $(document).ready(function() {
            var e, n;
            return $(".js-new-org-team").length > 0 && (e = $("#team-name"), n = e.val().trim()) ? t($(".org-team-form"), e, n) : void 0
        })
    }.call(this),
    function() {
        $(document).on("selectmenu:selected", ".js-select-team-repo-permission .js-navigation-item", function() {
            var t, e, n, i, s;
            return t = $(this), s = t.parents(".js-select-team-repo-permission"), e = t.attr("data-level-text"), n = s.find(".js-menu-target"), i = t.parents(".js-org-repo"), s.addClass("is-updating"), s.removeClass("was-successful"), $.ajax({
                url: s.attr("data-url"),
                method: "PUT",
                data: {
                    perm: t.attr("data-ref"),
                    fork_count: i.find(".js-org-repo-forked").attr("data-repo-fork-count")
                },
                success: function() {
                    return n.html(e), s.removeClass("is-updating"), s.addClass("was-successful")
                },
                error: function() {
                    return alert("There was an error changing permission.")
                }
            })
        }), $(document).on("member-adder:error", ".js-team-repo-list", function() {
            return $("#ajax-error-message").show(function() {
                return $(this).addClass("visible")
            })
        })
    }.call(this),
    function() {
        $(document).on("submit", ".js-remove-team-members-form", function() {
            return $.sudo().then(function(t) {
                return function() {
                    var e, n;
                    return e = $(t), n = $.post(e.attr("action"), e.serialize()), n.then(function() {
                        var t;
                        return t = e.closest(".js-org-section"), e.closest(".js-edit-team-member").remove(), t.toggleClass("is-empty", !t.find(".js-org-list").children().length)
                    })
                }
            }(this)), !1
        }), $(document).on("submit", ".js-remove-team-repository", function() {
            var t, e;
            return t = $(this), e = $.ajax(t.attr("action"), {
                type: "DELETE",
                data: t.serialize()
            }), e.then(function() {
                var e;
                return e = t.closest(".js-org-section"), t.closest(".js-org-repo").remove(), e.toggleClass("is-empty", !e.find(".js-org-list").children().length)
            }), !1
        }), $(document).on("click", ".js-team-description-toggle", function() {
            return $(".js-description-toggler").toggleClass("on")
        }), $(document).on("ajaxComplete", ".js-team-description-form", function() {
            var t;
            return t = $(".js-team-description-field").val(), $(".js-description-toggler").toggleClass("on"), t.trim() ? $(".js-team-description .description").text(t) : $(".js-team-description .description").html("<span class='link'>This team has no description</span>")
        }), $(document).on("member-adder:added", ".js-org-list", function() {
            return $(this).closest(".js-org-section").toggleClass("is-empty", !this.childElementCount)
        })
    }.call(this),
    function() {
        $(function() {
            var t;
            return $("#load-readme").click(function() {
                var e, n, i, s, a, r;
                return n = $("#gollum-editor-body"), e = $("#editor-body-buffer"), s = $("#undo-load-readme"), r = e.text(), t(n, e), i = $(this), i.prop("disabled", !0), i.text(i.data("readme-name") + " loaded"), s.show(), a = function() {
                    return $(this).val() !== r && s.hide(), n.off("change keyup", a)
                }, n.on("change keyup", a), !1
            }), $("#undo-load-readme").click(function() {
                var e;
                return t($("#gollum-editor-body"), $("#editor-body-buffer")), e = $("#load-readme"), e.prop("disabled", !1), e.text("Load " + e.data("readme-name")), $(this).hide(), !1
            }), t = function(t, e) {
                var n, i, s;
                return n = $(t), i = $(e), s = n.val(), n.val(i.text()), i.text(s)
            }
        })
    }.call(this),
    function() {
        $(document).on("ajaxSuccess", ".js-cleanup-pull-request", function(t, e, n, i) {
            var s, a, r;
            r = i.updateContent;
            for (a in r) s = r[a], $(a).updateContent(s)
        }), $(document).on("ajaxError", ".js-cleanup-pull-request", function(t, e) {
            return $(this).addClass("error"), $(this).closest(".js-deletable-state").removeClass("mergeable-merged").addClass("mergeable-error"), e.responseText && $(this).find(".js-cleanup-error-message").html(e.responseText), !1
        })
    }.call(this),
    function() {
        $(document).on("details:toggled", ".js-pull-merging", function() {
            var t;
            return t = $(this).find(".js-merge-pull-request"), t.toggleClass("js-dirty", t.is($.visible))
        }), $(document).on("ajaxSuccess", ".js-merge-pull-request", function(t, e, n, i) {
            var s, a, r;
            this.reset(), $(this).removeClass("js-dirty"), r = i.updateContent;
            for (a in r) s = r[a], $(a).updateContent(s)
        }), $(document).on("ajaxError", ".js-merge-pull-request", function(t, e) {
            return $(this).addClass("error"), $(this).closest(".js-mergable-state").removeClass("mergeable-clean").addClass("mergeable-error"), e.responseText && $(this).find(".js-merge-error-message").text(e.responseText), !1
        })
    }.call(this),
    function() {
        var t;
        $.observeLast(".pull-request-ref-restore", "last"), t = function() {
            var t;
            return t = $("#js-pull-restorable").length, $(".pull-discussion-timeline").toggleClass("is-pull-restorable", t)
        }, $.observe("#js-pull-restorable", {
            add: t,
            remove: t
        }), $(document).on("ajaxSuccess", ".js-restore-head-ref", function(t, e, n, i) {
            var s, a, r;
            r = i.updateContent;
            for (a in r) s = r[a], $(a).updateContent(s)
        })
    }.call(this),
    function() {
        var t;
        t = function(t) {
            var e;
            return e = t.getAttribute("data-container-id"), document.getElementById(e)
        }, $(document).on("pjax:click", ".js-pull-request-tab", function(e, n) {
            return t(this) ? !1 : (n.push = !1, n.replace = !0)
        }), $(document).on("click", ".js-pull-request-tab", function(e) {
            var n, i, s, a, r;
            if (1 === e.which && !e.metaKey && !e.ctrlKey && (n = t(this))) {
                for (r = $(".js-pull-request-tab.selected"), s = 0, a = r.length; a > s; s++) i = r[s], $(i).removeClass("selected"), $(t(i)).removeClass("is-visible");
                return $(n).addClass("is-visible"), $(this).addClass("selected").blur(), $.support.pjax && window.history.replaceState($.pjax.state, "", this.href), !1
            }
        }), $(document).on("ajaxSuccess", ".js-inline-comment-form", function() {
            return $(this).closest("#discussion_bucket").length ? $("#files_bucket").remove() : $("#discussion_bucket").remove()
        }), $(document).on("socket:message", ".js-pull-request-tabs", function() {
            $(this).ajax()
        }), $(document).on("ajaxSuccess", ".js-pull-request-tabs", function(t, e, n, i) {
            var s;
            return s = $($.parseHTML(i)), $(this).find("#commits_tab_counter").replaceWith(s.find("#commits_tab_counter")), $(this).find("#files_tab_counter").replaceWith(s.find("#files_tab_counter"))
        }), $(document).on("socket:message", ".js-pull-request-stale-files", function() {
            return $("#files_bucket").addClass("is-stale")
        })
    }.call(this),
    function() {
        $(document).on("change", ".js-pulse-period", function(t) {
            var e;
            return e = $(t.target).attr("data-url"), $.pjax({
                url: e,
                container: "#js-repo-pjax-container"
            })
        })
    }.call(this),
    function() {
        $(document).on("navigation:open", ".js-create-branch", function() {
            return $(this).submit(), !1
        })
    }.call(this),
    function() {
        var t, e, n, i, s, a;
        $(document).on("click", ".js-releases-field a.remove", function() {
            var t;
            return t = $(this).closest("li"), t.addClass("delete"), t.find("input.destroy").val("true"), !1
        }), $(document).on("click", ".js-releases-field a.undo", function() {
            var t;
            return t = $(this).closest("li"), t.removeClass("delete"), t.find("input.destroy").val(""), !1
        }), $(document).on("click", ".js-timeline-tags-expander", function() {
            return $(this).closest(".js-timeline-tags").removeClass("is-collapsed")
        }), n = ["is-default", "is-saving", "is-saved", "is-failed"], i = function(t, e) {
            return t.removeClass(n.join(" ")), t.addClass(e), "is-saving" === e ? t.attr("disabled", "disabled") : t.removeAttr("disabled")
        }, $(document).on("click", ".js-save-draft", function(t, n) {
            var s, a, r, o, c, l;
            return $("#release_draft").val("1"), s = $(this), o = s.closest("form"), r = $("#delete_release_confirm form"), c = o.data("repo-url"), l = o.attr("action"), a = o.serialize(), i(s, "is-saving"), $.ajax({
                url: l,
                type: "POST",
                data: a,
                dataType: "json",
                success: function(t) {
                    var a, l;
                    return l = e("tag", c, t.tag_name), o.attr("action", l), r.attr("action", l), window.history.replaceState(null, document.title, e("edit", c, t.tag_name)), a = $("#release_id"), a.val() || (a.val(t.id), o.append('<input type="hidden" id="release_method" name="_method" value="put">')), i(s, "is-saved"), setTimeout(function() {
                        return i(s, "is-default")
                    }, 5e3), n ? n() : void 0
                },
                complete: function() {},
                error: function() {
                    return i(s, "is-failed")
                }
            }), t.preventDefault()
        }), $(document).on("click", ".js-publish-release", function() {
            return $("#release_draft").val("0")
        }), a = ["is-loading", "is-empty", "is-valid", "is-invalid", "is-duplicate", "is-pending"], s = function(t) {
            var e;
            switch (t) {
                case "is-valid":
                    $(".release-target-wrapper").addClass("hidden");
                    break;
                case "is-loading":
                    break;
                default:
                    $(".release-target-wrapper").removeClass("hidden")
            }
            return e = $(".js-release-tag"), e.removeClass(a.join(" ")), e.addClass(t)
        }, t = function(t) {
            return t.val() && t.val() !== t.attr("data-last-checked") ? (s("is-loading"), $.ajax({
                url: t.attr("data-url"),
                type: "GET",
                data: {
                    tag_name: t.val()
                },
                dataType: "json",
                success: function(e) {
                    return "duplicate" === e.status && parseInt(t.attr("data-existing-id")) === parseInt(e.release_id) ? void s("is-valid") : ($(".js-release-tag .js-edit-release-link").attr("href", e.url), s("is-" + e.status))
                },
                error: function() {
                    return s("is-invalid")
                },
                complete: function() {
                    return t.attr("data-last-checked", t.val())
                }
            })) : void 0
        }, e = function(t, e, n) {
            return "" + e + "/releases/" + t + "/" + n
        }, $(document).on("blur", ".js-release-tag-field", function() {
            return t($(this))
        }), $.observe(".js-release-tag-field", function() {
            t($(this))
        }), $(document).on("change", ".js-release-tag", function() {
            var t, e, n, i, s, a, r, o, c;
            if (n = $(this), t = n.closest("form"), e = t.find(".js-previewable-comment-form"), e.length) {
                for (i = e.data("base-preview-url"), i || (i = e.attr("data-preview-url"), i += i.indexOf("?") >= 0 ? "&" : "?", e.data("base-preview-url", i)), s = [], c = n.find('input[name="release[tag_name]"], input[name="release[target_commitish]"]:checked'), r = 0, o = c.length; o > r; r++) a = c[r], a.value && s.push({
                    name: a.name,
                    value: a.value
                });
                return e.attr("data-preview-url", i + $.param(s))
            }
        }), $.observe(".js-previewable-comment-form", function() {
            $(this).closest("form").find(".js-release-tag").trigger("change")
        })
    }.call(this),
    function() {
        var t, e = function(t, e) {
            return function() {
                return t.apply(e, arguments)
            }
        };
        t = function() {
            function t() {
                this.validate = e(this.validate, this), this.updateUpsell = e(this.updateUpsell, this), this.selectedPrivacyToggleElement = e(this.selectedPrivacyToggleElement, this), this.handlePrivacyChange = e(this.handlePrivacyChange, this), this.handleOwnerChange = e(this.handleOwnerChange, this), this.elements = {
                    ownerContainer: $(".js-owner-container"),
                    iconPreviewPublic: $(".js-icon-preview-public"),
                    iconPreviewPrivate: $(".js-icon-preview-private"),
                    upgradeUpsell: $("#js-upgrade-container").hide(),
                    upgradeConfirmationCheckbox: $(".js-confirm-upgrade"),
                    upsells: $(".js-upgrade"),
                    privacyToggles: $(".js-privacy-toggle"),
                    privateRadio: $(".js-privacy-toggle[value=false]"),
                    publicRadio: $(".js-privacy-toggle[value=true]"),
                    repoNameField: $("input[type=text].js-repo-name"),
                    form: $("#new_repository"),
                    licenseContainer: $(".js-license-container"),
                    teamBoxes: $(".js-team-select"),
                    suggestion: $(".js-reponame-suggestion")
                }, this.current_login = $("input[name=owner]:checked").prop("value"), this.privateRepo = !1, this.changedPrivacyManually = !1, this.elements.teamBoxes.hide(), this.elements.ownerContainer.on("change", "input[type=radio]", this.handleOwnerChange), this.elements.privacyToggles.on("change", function(t) {
                    return function(e) {
                        return t.handlePrivacyChange(e.targetElement, e)
                    }
                }(this)), this.elements.upgradeUpsell.on("change input", "input", this.validate), this.elements.form.on("repoform:validate", this.validate), this.elements.suggestion.on("click", function(t) {
                    return function(e) {
                        var n;
                        return n = t.elements.repoNameField, n.val($(e.target).text()), n.trigger("change")
                    }
                }(this)), this.handleOwnerChange(), this.validate()
            }
            return t.prototype.handleOwnerChange = function() {
                var t, e;
                return this.current_login = $("input[name=owner]:checked").prop("value"), this.elements.repoNameField.trigger("change"), e = this.elements.ownerContainer.find(".select-menu-item.selected"), this.elements.teamBoxes.hide().find("input, select").prop("disabled", !0), t = this.elements.teamBoxes.filter("[data-login=" + this.current_login + "]"), t.show().find("input, select").prop("disabled", !1), this.changedPrivacyManually || ("private" === e.attr("data-default") ? this.elements.privateRadio.prop("checked", "checked").change() : this.elements.publicRadio.prop("checked", "checked").change()), "yes" === e.attr("data-permission") ? ($(".with-permission-fields").show(), $(".without-permission-fields").hide(), $(".errored").show(), $("dl.warn").show()) : ($(".with-permission-fields").hide(), $(".without-permission-fields").show(), $(".errored").hide(), $("dl.warn").hide()), this.updateUpsell(), this.handlePrivacyChange()
            }, t.prototype.handlePrivacyChange = function(t, e) {
                var n;
                return null == t && (t = this.selectedPrivacyToggleElement()), null == e && (e = null), e && !e.isTrigger && (this.changedPrivacyManually = !0), n = this.elements.upgradeUpsell.find(".js-billing-section"), "false" === t.val() ? (this.privateRepo = !0, this.elements.upgradeUpsell.show(), n.removeClass("has-removed-contents"), this.elements.upgradeUpsell.find("input[type=checkbox]").prop("checked", "checked"), this.elements.iconPreviewPublic.hide(), this.elements.iconPreviewPrivate.show()) : (this.privateRepo = !1, this.elements.upgradeUpsell.hide(), n.addClass("has-removed-contents"), this.elements.upgradeUpsell.find("input[type=checkbox]").prop("checked", null), this.elements.form.attr("action", this.elements.form.attr("data-url")), this.elements.iconPreviewPrivate.hide(), this.elements.iconPreviewPublic.show()), this.validate()
            }, t.prototype.selectedPrivacyToggleElement = function() {
                return this.elements.privateRadio.is(":checked") ? this.elements.privateRadio : this.elements.publicRadio
            }, t.prototype.updateUpsell = function() {
                var t;
                return t = this.elements.upsells.filter("[data-login=" + this.current_login + "]"), this.elements.upgradeUpsell.html(t)
            }, t.prototype.validate = function() {
                var t, e;
                return e = !0, this.elements.repoNameField.is(".is-autocheck-successful") || (e = !1), t = this.elements.upgradeUpsell.find("input[type=checkbox]"), this.privateRepo && t.length && !t.is(":checked") && (e = !1), this.elements.form.find("button.primary").prop("disabled", !e)
            }, t
        }(), $(function() {
            return $(".page-new-repo").length ? new t : void 0
        }), $(document).on("autocheck:send", "#repository_name", function(t, e) {
            var n, i;
            n = $(this), i = n.closest("form").find("input[name=owner]:checked").val(), e.data.owner = i, n.trigger("repoform:validate")
        }), $(document).on("autocheck:complete", "#repository_name", function() {
            return $(this).trigger("repoform:validate")
        }), $(document).on("autocheck:success", "#repository_name", function(t, e) {
            var n, i, s;
            return i = $(this).val(), i && i !== e.name ? (n = $(this).closest("dl.form"), n.addClass("warn"), s = $("<dd>").addClass("warning").text("Will be created as " + e.name), n.append(s)) : void 0
        })
    }.call(this),
    function() {
        var t;
        $(document).on("pjax:end", function() {
            var t, e, n, i, s, a, r, o, c, l, u;
            if (s = $(document.head).find("meta[name='selected-link']").attr("value"), null != s)
                for (e = $(".js-repository-container-pjax .js-selected-navigation-item").removeClass("selected"), a = 0, o = e.length; o > a; a++)
                    for (t = e[a], i = null != (l = $(t).attr("data-selected-links")) ? l : "", u = i.split(" "), r = 0, c = u.length; c > r; r++) n = u[r], n === s && $(t).addClass("selected")
        }), $(document).on("click", ".js-repo-home-link, .js-repository-container-pjax a", function(t) {
            var e, n;
            if (!$(this).hasClass("js-disable-pjax")) return n = !1, e = $("#js-repo-pjax-container"), $.pjax.click(t, {
                container: e,
                scrollTo: n
            })
        }), t = function() {
            var t, e;
            return t = null != document.getElementById("js-show-full-navigation"), $(".repository-with-sidebar").toggleClass("with-full-navigation", t), t ? (e = $.get($(".js-repo-nav").attr("data-issue-count-url")), e.then(function(t) {
                return $(".js-issue-replace-counter").replaceWith(t.issues_count), $(".js-pull-replace-counter").replaceWith(t.pulls_count)
            })) : void 0
        }, $(function() {
            var e;
            return (e = document.getElementById("js-repo-pjax-container")) ? t(e) : void 0
        }), $(document).on("pjax:end", "#js-repo-pjax-container", function() {
            return t(this)
        }), $(document).on("pjax:clicked", ".js-directory-link", function() {
            return $(this).closest("tr").addClass("is-loading"), $(document.body).addClass("disables-context-loader")
        }), $(document).on("pjax:click", ".js-octicon-loaders a", function() {
            return $(this).addClass("is-loading"), $(document).one("pjax:end", function(t) {
                return function() {
                    return $(t).removeClass("is-loading")
                }
            }(this))
        }), $(function() {
            var t;
            return t = $(".mini-nav, .repo-container .menu"), t.length ? $.each(t, function(t, e) {
                return new FastClick(e)
            }) : void 0
        })
    }.call(this),
    function() {
        var t;
        t = function() {
            return $(".js-repo-toggle-team:checked").visible()
        }, $(document).onFocusedInput(".js-repository-name", function() {
            var t, e, n;
            return e = /[^0-9A-Za-z_\-.]/g, n = $(".js-form-note"), t = $(".js-rename-repository-button"),
                function() {
                    n.html("Will be renamed as <code>" + this.value.replace(e, "-") + "</code>"), e.test(this.value) ? n.show() : n.hide(), this.value && this.value !== $(this).attr("data-original-name") ? t.prop("disabled", !1) : t.prop("disabled", !0)
                }
        }), $(document).on("click", ".js-repo-team-suggestions-view-all", function() {
            return $.get(this.href, function(e) {
                return function(n) {
                    var i, s;
                    return s = t().map(function() {
                        return this.value
                    }), i = $(e).closest("ul"), i.html(n), s.each(function() {
                        return i.find(".js-repo-toggle-team[value=" + this + "]").prop("checked", !0)
                    })
                }
            }(this)), !1
        })
    }.call(this),
    function() {
        var t, e;
        t = function(t) {
            var e;
            return e = $(".js-site-search-form")[0], e.setAttribute("action", e.getAttribute("data-global-search-url")), $(".js-site-search").removeClass("repo-scope"), t.setAttribute("placeholder", t.getAttribute("data-global-scope-placeholder"))
        }, e = function(t) {
            var e;
            return e = $(".js-site-search-form")[0], e.setAttribute("action", e.getAttribute("data-repo-search-url")), $(".js-site-search").addClass("repo-scope"), t.setAttribute("placeholder", t.getAttribute("data-repo-scope-placeholder"))
        }, $(document).on("keyup", ".js-site-search-field", function(n) {
            var i;
            return i = this.value, "" === i && "backspace" === n.hotkey && this.classList.contains("is-clearable") && t(this), "" === i && "esc" === n.hotkey && e(this), this.classList.toggle("is-clearable", "" === i)
        }), $(document).on("focusout", ".js-site-search-field", function() {
            "" === this.value && e(this)
        })
    }.call(this),
    function() {
        $(document).on("ajaxSend", ".js-action-ldap-create", function() {
            return $(this).find(".minibutton").addClass("disabled")
        }), $(document).on("ajaxComplete", ".js-action-ldap-create", function(t, e) {
            var n, i;
            return n = $(this), i = 500 === e.status ? "Oops, something went wrong." : e.responseText, n.find(".js-message").show().html(" &ndash; " + i), 200 === e.status && n.find(".button").hide(), !1
        })
    }.call(this),
    function() {
        $(document).on("ajaxSend", ".js-action-pull", function() {
            return $(this).find(".minibutton").not(".disabled").addClass("reenable disabled")
        }), $(document).on("ajaxComplete", ".js-action-pull", function(t, e) {
            var n, i, s;
            return n = $(this), s = $(t.target), 200 === e.status && (s.hasClass("close") || s.hasClass("open") ? $.pjax.reload($("#js-pjax-container")) : n.find(".reenable").removeClass("reenable disabled")), i = 500 === e.status ? "Oops, something went wrong." : e.responseText, n.find(".js-message").show().html(i), !1
        })
    }.call(this),
    function() {
        $.support.pjax && $(document).on("submit", ".js-stars-search", function(t) {
            var e;
            return (e = $(this).closest("[data-pjax-container]")[0]) ? $.pjax.submit(t, {
                container: e
            }) : void 0
        })
    }.call(this),
    function() {
        $(document).on("click", ".js-example-transition", function() {
            return $(this).performTransition(function() {
                return this.removeClass("in")
            }), !1
        })
    }.call(this),
    function() {
        $(document).on("ajaxBeforeSend", ".js-auto-subscribe-toggle", function() {
            return $(this).find(".js-status-indicator").removeClass("status-indicator-success").removeClass("status-indicator-loading").addClass("status-indicator-loading")
        }), $(document).on("ajaxError", ".js-auto-subscribe-toggle", function() {
            return $(this).find(".js-status-indicator").removeClass("status-indicator-loading").addClass("status-indicator-failed")
        }), $(document).on("ajaxSuccess", ".js-auto-subscribe-toggle", function() {
            return $(this).find(".js-status-indicator").removeClass("status-indicator-loading").addClass("status-indicator-success")
        }), $(document).on("ajaxBeforeSend", ".js-unignore-form, .js-ignore-form", function() {
            return $(this).closest(".js-subscription-row").addClass("loading")
        }), $(document).on("ajaxError", ".js-unignore-form, .js-ignore-form", function() {
            return $(this).closest(".js-subscription-row").removeClass("loading"), $(this).find(".minibutton").addClass("danger").attr("title", "There was a problem unignoring this repo.")
        }), $(document).on("ajaxSuccess", ".js-unignore-form", function() {
            return $(this).closest(".js-subscription-row").removeClass("loading").addClass("unsubscribed")
        }), $(document).on("ajaxSuccess", ".js-ignore-form", function() {
            return $(this).closest(".js-subscription-row").removeClass("loading unsubscribed")
        }), $(document).on("ajaxBeforeSend", ".js-unsubscribe-form, .js-subscribe-form", function() {
            return $(this).closest(".js-subscription-row").addClass("loading")
        }), $(document).on("ajaxError", ".js-unsubscribe-form, .js-subscribe-form", function() {
            return $(this).closest(".js-subscription-row").removeClass("loading"), $(this).find(".minibutton").addClass("danger").attr("title", "There was a problem with unsubscribing :(")
        }), $(document).on("ajaxSuccess", ".js-unsubscribe-form", function() {
            return $(this).closest(".js-subscription-row").removeClass("loading").addClass("unsubscribed")
        }), $(document).on("ajaxSuccess", ".js-subscribe-form", function() {
            return $(this).closest(".js-subscription-row").removeClass("loading unsubscribed")
        }), $(document).on("ajaxSuccess", ".js-thread-subscription-status", function(t, e, n, i) {
            return $(".js-thread-subscription-status").updateContent(i)
        })
    }.call(this),
    function() {
        var t;
        t = function() {
            return $(".js-team-add-user-form[data-ajax-save-enabled]").length > 0
        }, $(document).on("autocomplete:search", ".js-team-add-user-name", function() {
            var t, e;
            return e = $(this).val(), t = $(".js-team-add-user-autocomplete-results"), "" === e ? (t.find("ul").empty(), void t.trigger("autocomplete:change")) : $(this).ajax({
                data: {
                    q: e
                },
                success: function(e) {
                    return t.find("ul").html(e), t.trigger("autocomplete:change")
                }
            })
        }), $(document).on("autocomplete:autocompleted:changed", ".js-team-add-user-name", function() {
            var t;
            return t = $(".js-team-add-user-button")[0], t.disabled = !$(this).attr("data-autocompleted")
        }), $(document).on("click", ".js-team-remove-user", function(e) {
            var n, i, s;
            return e.preventDefault(), $(".js-team-add-user-form").removeClass("hidden"), $(".js-team-add-user-name").focus(), n = $(this).closest("li").remove(), i = n.attr("data-login"), t() ? (s = $(".js-team-add-user-form").attr("data-destroy-url"), $.ajax({
                url: s,
                data: {
                    member: i
                },
                type: "POST"
            })) : void 0
        }), $(document).on("click", ".js-team-add-user-button", function(e) {
            var n, i, s, a, r, o;
            if (e.preventDefault(), n = $(".js-team-add-user-name"), s = n.val(), s && n.attr("data-autocompleted")) {
                for (n.val(""), o = $(".js-team-user-logins li"), a = 0, r = o.length; r > a; a++)
                    if (i = o[a], $(i).attr("data-login") === s) return;
                return $.sudo().then(function() {
                    var e;
                    return t() && (e = $(".js-team-add-user-form").attr("data-create-url"), $.ajax({
                        url: e,
                        data: {
                            member: s
                        },
                        type: "POST"
                    })), $.ajax({
                        url: $(".js-team-add-user-form").attr("data-template-url"),
                        data: {
                            member: s
                        },
                        success: function(e) {
                            return $(".js-team-user-logins").append(e), $(".js-login-field").prop("disabled", t()), t() ? void 0 : $(".js-team-add-user-form").addClass("hidden")
                        }
                    }), $(".js-team-add-user-name").focus()
                })
            }
        })
    }.call(this),
    function() {
        var t, e, n = function(t, e) {
            return function() {
                return t.apply(e, arguments)
            }
        };
        t = function() {
            function t(t) {
                var e;
                e = $(t), this.name = e.data("theme-name"), this.slug = e.data("theme-slug"), this.baseHref = e.attr("href")
            }
            return t.prototype.wrappedKey = function(t, e) {
                return null == e && (e = null), e ? "" + e + "[" + t + "]" : t
            }, t.prototype.params = function(t) {
                var e;
                return null == t && (t = null), e = {}, e[this.wrappedKey("theme_slug", t)] = this.slug, e
            }, t.prototype.previewSrc = function() {
                return [this.baseHref, $.param(this.params())].join("&")
            }, t
        }(), e = function() {
            function e() {
                this.updateScrollLinks = n(this.updateScrollLinks, this), this.scrollThemeLinksContainer = n(this.scrollThemeLinksContainer, this), this.onPublishClick = n(this.onPublishClick, this), this.onHideClick = n(this.onHideClick, this), this.onThemeLinkClick = n(this.onThemeLinkClick, this), this.onThemeNavNextClick = n(this.onThemeNavNextClick, this), this.onThemeNavPrevClick = n(this.onThemeNavPrevClick, this), this.onScrollForwardsClick = n(this.onScrollForwardsClick, this), this.onScrollBackwardsClick = n(this.onScrollBackwardsClick, this), this.onPagePreviewLoad = n(this.onPagePreviewLoad, this), this.pagePreview = $("#page-preview"), this.contextLoader = $(".theme-picker-spinner"), this.fullPicker = $(".theme-picker-thumbs"), this.miniPicker = $(".theme-picker-controls"), this.scrollBackwardsLinks = $(".theme-toggle-full-left"), this.scrollForwardsLinks = $(".theme-toggle-full-right"), this.prevLinks = $(".theme-picker-prev"), this.nextLinks = $(".theme-picker-next"), this.themeLinksContainer = this.fullPicker.find(".js-theme-selector"), this.themeLinks = this.themeLinksContainer.find(".theme-selector-thumbnail"), this.themes = [], this.themeLinks.each(function(e) {
                    return function(n, i) {
                        return e.themes.push(new t(i))
                    }
                }(this)), this.selectedTheme = this.themes[0], this.pagePreview.load(this.onPagePreviewLoad), this.scrollBackwardsLinks.click(this.onScrollBackwardsClick), this.scrollForwardsLinks.click(this.onScrollForwardsClick), this.prevLinks.click(this.onThemeNavPrevClick), this.nextLinks.click(this.onThemeNavNextClick), this.themeLinks.click(this.onThemeLinkClick), $(".theme-picker-view-toggle").click(this.onHideClick), $("#page-edit").click(this.onEditClick), $("#page-publish").click(this.onPublishClick), this.theme(this.selectedTheme), this.updateScrollLinks()
            }
            return e.prototype.onPagePreviewLoad = function() {
                var t, e;
                return this.contextLoader.removeClass("visible"), t = this.pagePreview[0].contentDocument ? this.pagePreview[0].contentDocument : this.pagePreview[0].contentWindow.document, e = "" + this.getDocHeight(t) + "px", this.pagePreview.css("visibility", "hidden"), this.pagePreview.height("10px"), this.pagePreview.height(e), this.pagePreview.css("visibility", "visible")
            }, e.prototype.onScrollBackwardsClick = function() {
                return this.scrollThemeLinksContainer(-1)
            }, e.prototype.onScrollForwardsClick = function() {
                return this.scrollThemeLinksContainer(1)
            }, e.prototype.onThemeNavPrevClick = function() {
                return this.theme(this.prevTheme())
            }, e.prototype.onThemeNavNextClick = function() {
                return this.theme(this.nextTheme())
            }, e.prototype.onThemeLinkClick = function(t) {
                return this.theme(this.themeForLink(t.currentTarget)), !1
            }, e.prototype.onHideClick = function(t) {
                var e;
                return this.fullPicker.toggle(), this.miniPicker.toggle(), this.scrollToTheme(this.theme(), !1), e = $(t.currentTarget), e.toggleClass("open")
            }, e.prototype.onEditClick = function() {
                return $("#page-edit-form").submit(), !1
            }, e.prototype.onPublishClick = function() {
                var t;
                return t = $("#page-publish-form"), t.find('input[name="page[theme_slug]"]').val(this.theme().slug), $("#page-publish-form").submit(), !1
            }, e.prototype.scrollThemeLinksContainer = function(t) {
                var e, n, i;
                return n = this.themeLinksContainer.scrollLeft(), i = this.themeLinksContainer.outerWidth(!0), e = n + i * t, this.themeLinksContainer.animate({
                    scrollLeft: e
                }, 400, function(t) {
                    return function() {
                        return t.updateScrollLinks()
                    }
                }(this)), !1
            }, e.prototype.updateScrollLinks = function() {
                var t, e, n;
                return t = this.themeLinksContainer.scrollLeft(), 0 >= t ? (this.scrollBackwardsLinks.addClass("disabled"), this.scrollForwardsLinks.removeClass("disabled")) : (this.scrollBackwardsLinks.removeClass("disabled"), n = this.themeLinksContainer[0].scrollWidth, e = n - this.themeLinksContainer.outerWidth(!0), t >= e ? this.scrollForwardsLinks.addClass("disabled") : this.scrollForwardsLinks.removeClass("disabled"))
            }, e.prototype.selectedThemeIndex = function() {
                return this.themes.indexOf(this.selectedTheme)
            }, e.prototype.prevTheme = function() {
                var t;
                return t = (this.selectedThemeIndex() - 1) % this.themes.length, 0 > t && (t += this.themes.length), this.themes[t]
            }, e.prototype.nextTheme = function() {
                return this.themes[(this.selectedThemeIndex() + 1) % this.themes.length]
            }, e.prototype.themeForLink = function(t) {
                return this.themes[this.themeLinks.index($(t))]
            }, e.prototype.linkForTheme = function(t) {
                return $(this.themeLinks[this.themes.indexOf(t)])
            }, e.prototype.scrollToTheme = function(t, e) {
                var n, i, s, a, r, o;
                return null == e && (e = !0), n = this.linkForTheme(t), o = this.themes.indexOf(t), a = n.outerWidth(!0), s = o * a, i = this.themeLinksContainer.scrollLeft(), r = i + this.themeLinksContainer.outerWidth(!0), i > s || s + a > r ? e ? this.themeLinksContainer.animate({
                    scrollLeft: s
                }, 500) : this.themeLinksContainer.scrollLeft(s) : void 0
            }, e.prototype.theme = function(t) {
                return null == t && (t = null), t ? (this.selectedTheme = t, this.showPreviewFor(t), this.themeLinks.removeClass("selected"), this.linkForTheme(t).addClass("selected"), this.scrollToTheme(t), this.miniPicker.find(".js-theme-name").text(t.name), !1) : this.selectedTheme
            }, e.prototype.showPreviewFor = function(t) {
                var e;
                return this.contextLoader.addClass("visible"), e = this.fullPicker.find("form"), e.find('input[name="theme_slug"]').val(t.slug), e.submit()
            }, e.prototype.getDocHeight = function(t) {
                var e, n;
                return this.pagePreview.height("auto"), e = t.body, n = t.documentElement, Math.max(e.scrollHeight, e.offsetHeight, n.clientHeight, n.scrollHeight, n.offsetHeight)
            }, e
        }(), $(function() {
            return document.getElementById("theme-picker-wrap") ? new e : void 0
        })
    }.call(this),
    function() {
        $(document).on("click", ".js-transfer-owner-select-target", function() {
            return $(this).hasClass("disabled") ? void 0 : $(this).closest("form").submit()
        })
    }.call(this),
    function() {
        var t, e, n, i, s;
        n = function(t) {
            return setTimeout(function() {
                var e, n, s, a, r;
                for (a = $(".js-tree-finder-field"), r = [], n = 0, s = a.length; s > n; n++) e = a[n], e.value = t, r.push(i(e));
                return r
            }, 0)
        }, s = null, i = function(t, e) {
            var n, a, r, o, c, l, u, d, h, f, m, p, g;
            if (h = document.getElementById($(t).attr("data-results"))) {
                if (!(r = $(h).data("tree-finder-list"))) return void(null == s && (s = $.ajax({
                    url: $(h).attr("data-url"),
                    cache: !0,
                    success: function(e) {
                        return $(h).data("tree-finder-list", e.paths), i(t)
                    },
                    complete: function() {
                        return s = null
                    }
                })));
                for (f = $(h).find(".js-tree-browser-result-template").children()[0], l = $(h).find(".js-tree-finder-results"), null == e && (e = $(t).val()), e ? (o = $.fuzzyRegexp(e), d = $.fuzzySort(r, e)) : d = r, d = function() {
                        var t, e, i, s;
                        for (i = d.slice(0, 50), s = [], t = 0, e = i.length; e > t; t++) u = i[t], c = f.cloneNode(!0), n = c.querySelector(".js-tree-finder-path"), a = new URL(n.href), a.pathname = "" + a.pathname + "/" + u, n.href = a.href, n.textContent = u, s.push(c);
                        return s
                    }(), l.html(d), g = l.find(".tree-browser-result a"), m = 0, p = g.length; p > m; m++) c = g[m], $.fuzzyHighlight(c, e, o);
                l.navigation("focus")
            }
        }, $(document).onFocusedKeydown(".js-tree-finder-field", function(t) {
            return i(this), $(this).on("throttled:input." + t, function() {
                    return i(this)
                }),
                function(t) {
                    return "esc" === t.hotkey ? (history.back(), t.preventDefault()) : void 0
                }
        }), t = function() {
            var t;
            return t = $("<textarea>").css({
                    position: "fixed",
                    top: 0,
                    left: 0,
                    opacity: 0
                }), $(document.body).append(t), t.focus(),
                function() {
                    return t.blur().remove().val()
                }
        }, e = null, $(document).on("pjax:click", ".js-show-file-finder", function() {
            return e = t()
        }), $(document).on("pjax:end", "#js-repo-pjax-container", function() {
            var t;
            return e ? ((t = e()) && n(t), e = null) : void 0
        }), $.observe(".js-tree-finder-field", function() {
            i(this)
        })
    }.call(this),
    function() {
        var t, e, n, i;
        n = function() {
            return $("body").addClass("is-sending"), $("body").removeClass("is-sent is-not-sent")
        }, i = function() {
            return $("body").addClass("is-sent"), $("body").removeClass("is-sending")
        }, e = function(t) {
            return t.responseText.length && $(".js-sms-error").text(t.responseText), $("body").addClass("is-not-sent"), $("body").removeClass("is-sending")
        }, t = function(t) {
            return n(), $.ajax({
                url: t,
                type: "POST",
                success: i,
                error: e
            }), !1
        }, $(document).on("click", ".js-resend-auth-code", function() {
            return t("/sessions/two_factor/resend")
        }), $(document).on("click", ".js-send-fallback-auth-code", function() {
            return t("/sessions/two_factor/send_fallback")
        }), $(document).on("click", ".js-send-two-factor-code", function() {
            var t, s, a, r, o;
            return t = $(this).closest("form"), s = t.find(".js-country-code-select").val(), a = t.find(".js-sms-number").val(), r = "" + s + " " + a, o = t.find(".js-two-factor-secret").val(), t.find("input,button,select").prop("disabled", !0), n(), $.ajax({
                url: "/settings/two_factor_authentication/send_sms",
                type: "POST",
                data: {
                    number: r,
                    two_factor_secret: o
                },
                success: function() {
                    return i(), t.find(".js-2fa-enable").prop("disabled", !1), t.find(".js-2fa-confirm").prop("disabled", !0), t.find(".js-2fa-otp").focus()
                },
                error: function(n) {
                    return e(n), t.find(".js-2fa-enable").prop("disabled", !0), t.find(".js-2fa-confirm").prop("disabled", !1)
                }
            }), !1
        }), $(document).on("click", "button.js-2fa-enable", function() {
            var t;
            return t = $(this).closest("form"), t.find("input,button,select").prop("disabled", !1)
        }), $(document).on("ajaxBeforeSend", ".js-add-yubicat", function() {
            return $(this).find("input").prop("disabled", !0)
        }), $(document).on("ajaxSuccess", ".js-yubicat-box", function() {
            return $(this).find(".js-yubicat-error").hide(), $(this).find(".js-add-yubicat input").prop("disabled", !1)
        }), $(document).on("ajaxError", ".js-yubicat-box", function(t, e) {
            var n;
            return $(this).find(".js-add-yubicat input").prop("disabled", !1).val(""), n = $(this).find(".js-yubicat-error"), n.html(422 === e.status && "" !== e.responseText.replace(/\s/, "") ? e.responseText : "There was an error. Refresh the page and try again."), n.show(), !1
        }), $(document).on("ajaxSuccess", ".js-delete-yubicat", function() {
            return $(this).closest("li").remove()
        }), $(document).on("ajaxSuccess", ".js-add-yubicat", function(t, e) {
            var n, i, s;
            return $(this).find("input").val(""), i = $(this).closest("ul").find(".js-yubicat-template").clone(), n = i.find("a"), s = n.attr("href").replace("deviceId", e.responseText), n.attr("href", s), i.find("code").html(e.responseText), i.removeClass("yubicat-template"), $(this).closest("li").before(i)
        }), $(document).on("loading.facebox", function() {
            return "/settings/two_factor_authentication/configure" === window.location.pathname ? ($(".js-configure-sms-fallback .facebox-alert").text("").hide(), $(".js-configure-sms-fallback").show(), $(".js-verify-sms-fallback").hide()) : void 0
        }), $(document).on("ajaxSuccess", ".js-two-factor-set-sms-fallback", function(t, e) {
            switch (e.status) {
                case 200:
                case 201:
                    return window.location.reload();
                case 202:
                    return $(".js-configure-sms-fallback").hide(), $(".js-verify-sms-fallback").show(), $(".js-fallback-otp").focus()
            }
        }), $(document).on("ajaxError", ".js-two-factor-set-sms-fallback", function(t, e) {
            switch (e.status) {
                case 422:
                    return window.location.reload();
                case 429:
                    return $(".js-configure-sms-fallback .facebox-alert").text(e.responseText).show(), !1
            }
        })
    }.call(this),
    function() {
        $(document).on("click", ".js-user-sessions-revoke", function() {
            return $.sudo().then(function(t) {
                return function() {
                    return $.ajax({
                        type: "DELETE",
                        url: t.href
                    }).then(function() {
                        return $(t).closest("li").remove()
                    })
                }
            }(this)), !1
        })
    }.call(this),
    function() {
        var t, e, n, i, s, a, r;
        $.support.pjax && GitHub.performanceEnabled() && (e = null, s = "last_pjax_request", a = "pjax_start", i = "pjax_end", n = function(t) {
            var n, i;
            (n = null != (i = t.relatedTarget) ? i.href : void 0) && (window.performance.mark(a), e = n)
        }, r = function() {
            setImmediate(function() {
                var n, r;
                if (window.performance.getEntriesByName(a).length && (window.performance.mark(i), window.performance.measure(s, a, i), r = window.performance.getEntriesByName(s), n = r.pop().duration)) return GitHub.stats({
                    pjax: {
                        url: e,
                        ms: Math.round(n)
                    }
                }), t()
            })
        }, t = function() {
            window.performance.clearMarks(a), window.performance.clearMarks(i), window.performance.clearMeasures(s)
        }, $(document).on("pjax:start", n), $(document).on("pjax:end", r))
    }.call(this),
    function() {
        $(document).on("click", ".js-rich-diff.collapsed .js-expandable", function(t) {
            return t.preventDefault(), $(t.target).closest(".js-rich-diff").removeClass("collapsed")
        }), $(".js-show-rich-diff").on("click", function(t) {
            return t.preventDefault(), $(".js-warn-no-visible-changes").hide(), $(t.target).closest(".js-rich-diff").find(".js-no-changes").removeClass("hidden").show()
        })
    }.call(this),
    function() {
        var t, e, n, i, s, a;
        e = function() {
            return $(".user-interests-item").not(".hidden").length
        }, s = function() {
            return 0 === e() ? ($(".recommendations-outro").fadeOut(100), $(".recommendations-intro").fadeIn(100)) : ($(".recommendations-intro").fadeOut(100), $(".recommendations-outro").fadeIn(100))
        }, a = function() {
            var t, n;
            return t = e(), n = function() {
                switch (!1) {
                    case 0 !== t:
                        return "Which programming languages, frameworks, topics, etc.?";
                    case 1 !== t:
                        return "Awesome! What else?";
                    case 2 !== t:
                        return "Excellent \u2013 let's keep going!";
                    case 3 !== t:
                        return "These are great. Anything else?";
                    case 4 !== t:
                        return "Great! Maybe one more?"
                }
            }(), 5 === t ? ($(".js-user-recommendations-form").delay(500).hide(), $(".js-recommendations-complete").delay(500).show()) : $(".js-recommendations-complete").visible() && ($(".js-user-recommendations-form").show(), $(".js-recommendations-complete").hide()), $(".js-user-interests-input").attr("placeholder", n), s()
        }, i = null, t = function(t, e, s) {
            var r, o, c;
            return t = t.trim(), $(".js-button-skip").hide(), $(".js-user-interests-input").val(""), null == i && (i = $(".js-user-interests-item.hidden").remove().removeClass("hidden")[0]), o = i.cloneNode(!0), o.title = t, o.insertBefore(document.createTextNode(t), o.firstChild), $(".js-user-interests-list").append(o), o = $(o), c = o.offset(), r = Math.abs(s - c.left), o.css("position", "absolute").css("top", e).css("left", s).fadeIn(100).animate({
                top: c.top,
                left: c.left - 8
            }, {
                duration: 300 + .2 * r,
                specialEasing: {
                    top: "easeInBack"
                },
                complete: function() {
                    return $(this).css("position", "relative"), $(this).css("top", 0), $(this).css("left", 0), $.post("/recommendations/add", {
                        interest: t
                    }, function() {
                        return n()
                    })
                }
            }), a()
        }, $.easing.easeInBack = function(t, e, n, i, s, a) {
            return void 0 === a && (a = 3.70158), i * (e /= s) * e * ((a + 1) * e - a) + n
        }, n = function() {
            return $.pjax({
                url: "/recommendations",
                container: "#site-container"
            })
        }, $(document).on("pjax:complete", function() {
            return a()
        }), $(function() {
            return $(".user-interests-item").length ? a() : void 0
        }), $(document).on("submit", ".js-user-recommendations-form", function(e) {
            var n, i, s, a, r;
            return e.preventDefault(), n = $(".js-user-interests-input"), i = n.val(), a = n.offset(), r = a.top, s = a.left, t(i, r, s)
        }), $(document).on("click", ".js-interest-option", function(e) {
            var n, i, s, a, r;
            return e.preventDefault(), n = $(this), i = n.text(), a = n.offset(), r = a.top - n.height() / 2, s = a.left - n.width() / 2, t(i, r, s)
        }), $(document).on("click", ".js-user-interests-item-close", function(t) {
            var e, i;
            return t.preventDefault(), e = $(this).parent(".js-user-interests-item"), i = e.attr("title"), $.post("/recommendations/remove", {
                interest: i
            }, function() {
                return n()
            })
        }), $(document).onFocusedKeydown(".js-user-interests-input", function() {
            return function(t) {
                return "," === t.hotkey && ($(".js-user-recommendations-form").trigger("submit"), t.preventDefault()), "" === $(this).val() && "space" === t.hotkey ? t.preventDefault() : void 0
            }
        })
    }.call(this),
    function() {
        var t, e, n, i, s, a, r;
        a = ["is-render-pending", "is-render-ready", "is-render-loading", "is-render-loaded"].reduce(function(t, e) {
            return "" + t + " " + e
        }), s = function(t) {
            var e;
            return e = t.data("timing"), null != e ? (e.load = e.hello = null, e.helloTimer && (clearTimeout(e.helloTimer), e.helloTimer = null), e.loadTimer ? (clearTimeout(e.loadTimer), e.loadTimer = null) : void 0) : void 0
        }, e = function(t) {
            var e, n, i;
            if (!t.data("timing")) return e = 10, n = 45, i = {
                load: null,
                hello: null,
                helloTimer: null,
                loadTimer: null
            }, i.load = Date.now(), i.helloTimer = setTimeout(r(t, function() {
                return !i.hello
            }), 1e3 * e), i.loadTimer = setTimeout(r(t), 1e3 * n), t.data("timing", i)
        }, i = function(t) {
            return t.addClass("is-render-requested")
        }, n = function(t, e) {
            return t.removeClass(a), t.addClass("is-render-failed"), null != e && t.addClass("is-render-failed-" + e), s(t)
        }, r = function(t, e) {
            return null == e && (e = function() {
                    return !0
                }),
                function() {
                    var i;
                    if (t.is($.visible) && !t.hasClass("is-render-ready") && !t.hasClass("is-render-failed") && !t.hasClass("is-render-failed-fatally") && e()) return (i = t.data("timing")) ? (console.error("Render timeout: " + JSON.stringify(i) + " Now: " + Date.now()), n(t)) : console.error("No timing data on $:", t)
                }
        }, $.observe(".js-render-target", function() {
            var t, n;
            t = $(this), (null != (n = t.data("timing")) ? n.load : 0) || (s(t), e(t), t.addClass("is-render-automatic"), i(t))
        }), t = function(t) {
            var e;
            return e = ".js-render-target", $(t ? "" + e + "[data-identity='" + t + "']" : e)
        }, $(window).on("message", function(e) {
            var i, s, r, o, c, l, u, d, h, f, m, p, g, v, $;
            if (g = e.originalEvent, o = g.data, d = g.origin, o && d && (v = function() {
                    try {
                        return JSON.parse(o)
                    } catch (t) {
                        return e = t, o
                    }
                }(), p = v.type, l = v.identity, r = v.body, h = v.payload, p && r && 1 === (i = t(l)).length && d === i.data("host") && (f = i.data("timing") || {
                    untimed: !0
                }, "render" === p))) switch (r) {
                case "hello":
                    if (f.hello = Date.now(), s = {
                            type: "render:cmd",
                            body: {
                                cmd: "ack",
                                ack: !0
                            }
                        }, u = {
                            type: "render:cmd",
                            body: {
                                cmd: "branding",
                                branding: !1
                            }
                        }, m = null != ($ = i.find("iframe").get(0)) ? $.contentWindow : void 0, "function" == typeof m.postMessage && m.postMessage(JSON.stringify(s), "*"), "function" == typeof m.postMessage && m.postMessage(JSON.stringify(u), "*"), i.data("local")) return c = i.parents(".js-code-editor").data("code-editor"), u = {
                        type: "render:data",
                        body: c.code()
                    }, "function" == typeof m.postMessage ? m.postMessage(JSON.stringify(u), "*") : void 0;
                    break;
                case "error":
                    return n(i);
                case "error:fatal":
                    return n(i, "fatal");
                case "error:invalid":
                    return n(i, "invalid");
                case "loading":
                    return i.removeClass(a), i.addClass("is-render-loading");
                case "loaded":
                    return i.removeClass(a), i.addClass("is-render-loaded");
                case "ready":
                    if (i.removeClass(a), i.addClass("is-render-ready"), null != (null != h ? h.height : void 0)) return i.height(h.height);
                    break;
                case "resize":
                    return null != (null != h ? h.height : void 0) && i.hasClass("is-render-ready") ? i.height(h.height) : console.error("Resize event sent without height or before ready");
                default:
                    return console.error("Unknown message [" + p + "]=>'" + r + "'")
            }
        })
    }.call(this),
    function() {
        $(document).on("click", ".js-toggle-lang-stats", function(t) {
            var e, n;
            return $(".js-stats-switcher-viewport").toggleClass("is-revealing-lang-stats"), n = $(this).closest(".tooltipped").attr("aria-label"), e = "", e = n.match("Show") ? n.replace("Show", "Hide") : n.replace("Hide", "Show"), $(".js-toggle-lang-stats").closest(".tooltipped").attr("aria-label", e), $(this).trigger("mouseover"), t.preventDefault()
        })
    }.call(this),
    function() {
        var t, e;
        e = null, $(document).on("autocomplete:search", ".js-repository-new-collab-field", function() {
            return e && e.abort(), "" === $(this).val() ? ($(".js-new-collab-autocomplete-result-list").empty(), void $(".js-new-collab-autocomplete-results").trigger("autocomplete:change")) : e = $.ajax({
                type: "GET",
                data: {
                    q: $(this).val()
                },
                url: "/autocomplete/users",
                dataType: "html",
                success: function(t) {
                    return e = null, $(".js-new-collab-autocomplete-result-list").html(t), $(".js-new-collab-autocomplete-results").trigger("autocomplete:change")
                }
            })
        }), $(document).on("autocomplete:autocompleted:changed", ".js-repository-new-collab-field", function() {
            var t;
            return t = $(this).closest("form").find(".js-add-new-collab"), $(this).attr("data-autocompleted") ? t.removeAttr("disabled") : t.attr("disabled", "disabled")
        }), $(function() {
            return $(".js-add-new-collab").attr("disabled", "disabled")
        }), t = function(t) {
            return t ? $(".js-collab-error").text(t).show() : $(".js-collab-error").hide()
        }, $(document).on("submit", ".js-add-collab-form", function(e) {
            var n, i;
            return e.preventDefault(), n = $(".js-repository-new-collab-field"), i = n.val(), i && n.attr("data-autocompleted") ? (t(), $.ajax({
                url: this.action,
                data: {
                    member: i
                },
                type: "POST",
                dataType: "json",
                success: function(e) {
                    return n.val(""), e.error ? t(e.error) : ($(".js-collab-list").append(e.html), $(".js-empty-collab-list").remove())
                },
                error: function() {
                    return t("An unidentified error occurred, try again?")
                }
            })) : !1
        }), $(document).on("submit", ".js-add-team-form", function(e) {
            var n, i;
            return e.preventDefault(), n = $(".js-repository-new-team-select"), i = n.val().trim(), "" === i ? (t("You must select a team"), !1) : (t(), $.ajax({
                url: this.action,
                data: {
                    team: i
                },
                type: "POST",
                dataType: "json",
                success: function(e) {
                    return n.val(""), e.error ? t(e.error) : $(".js-repo-team-list").append(e.html)
                },
                error: function() {
                    return t("An unidentified error occurred, try again?")
                }
            }))
        }), $(document).on("click", ".js-remove-repo-access", function(e) {
            var n;
            return e.preventDefault(), t(), n = $(this).closest(".js-repo-access-entry"), $.ajax({
                type: "DELETE",
                url: this.href,
                success: function() {
                    return n.remove()
                },
                error: function() {
                    return t("Sorry, we couldn\u2019t remove access. Please try again.")
                }
            })
        })
    }.call(this),
    function() {
        $(document).on("change", ".js-repo-default-branch", function() {
            var t, e, n, i;
            return e = $(this), t = $(this).parents("dl.form"), n = t.find(".js-status-indicator"), i = e.val(), n.removeClass("status-indicator-success").removeClass("status-indicator-failed").addClass("status-indicator-loading"), $.ajax({
                type: "PUT",
                url: t.closest("form").attr("action"),
                data: {
                    field: "repository_default_branch",
                    value: i
                },
                complete: function() {
                    return n.removeClass("status-indicator-loading")
                },
                success: function() {
                    return n.addClass("status-indicator-success")
                },
                error: function() {
                    return n.addClass("status-indicator-failed"), e.val(i)
                }
            })
        }), $(document).on("change", ".js-repo-feature-checkbox", function() {
            var t, e, n;
            return e = this, n = $(this).closest(".js-repo-option"), t = n.find(".js-status-indicator"), t.removeClass("status-indicator-success").removeClass("status-indicator-failed").addClass("status-indicator-loading"), $.ajax({
                type: "PUT",
                url: n.closest("form").attr("action"),
                data: {
                    field: e.name,
                    value: e.checked ? 1 : 0
                },
                success: function(e) {
                    return t.removeClass("status-indicator-loading").addClass("status-indicator-success"), /^\s*</.test(e) ? $(".repo-nav").replaceWith(e) : void 0
                },
                error: function() {
                    return e.checked = !e.checked, t.removeClass("status-indicator-loading").addClass("status-indicator-failed")
                }
            })
        })
    }.call(this),
    function() {
        $(document).on("change", ".js-notifications-settings input[type=checkbox]", function() {
            var t, e;
            return t = $(this), e = t.parents("li").find(".js-auto-subscribe-spinner"), e.removeClass("hidden"), $.ajax({
                url: t.parents(".js-notifications-settings").attr("data-toggle-url"),
                type: "POST",
                data: t.parents(".js-notifications-settings").serialize(),
                complete: function() {
                    return e.addClass("hidden")
                }
            })
        }), $(document).on("ajaxSuccess", ".js-remove-item", function() {
            return $(this).parents("li").remove()
        }), $(document).on("submit", ".js-delete-email", function() {
            return $.sudo().then(function(t) {
                return function() {
                    return $.ajax({
                        type: "DELETE",
                        url: t.action
                    }).then(function() {
                        return $(t).closest("li").remove()
                    })
                }
            }(this)), !1
        }), $(document).on("ajaxSuccess", ".js-toggle-visibility", function(t, e, n, i) {
            return $("#settings-emails").children(".settings-email.primary").toggleClass("private", "private" === i.visibility)
        }), $(document).on("ajaxSend", ".js-remove-key", function() {
            return $(this).addClass("disabled").find("span").text("Deleting\u2026")
        }), $(document).on("ajaxError", ".js-remove-key", function() {
            return $(this).removeClass("disabled").find("span").text("Error. Try again.")
        }), $(document).on("ajaxSuccess", ".js-remove-key", function() {
            return $(this).parents("li").remove(), 0 === $(".js-ssh-keys-box li").length ? $(".js-no-ssh-keys").show() : void 0
        }), $(document).on("click", ".js-leave-collaborated-repo", function(t) {
            var e, n, i;
            return e = $(t.currentTarget), n = e.closest("[data-repo]").attr("data-repo"), i = $('ul.repositories li[data-repo="' + n + '"]'), $.ajax({
                url: "/account/leave_repo/" + n,
                type: "POST"
            }), $.facebox.close(), i.fadeOut(), !1
        }), $(document).on("ajaxError", ".js-name-change-in-progress", function() {
            return $(".js-name-change-in-progress").hide(), $(".js-name-change-error").show()
        }), $(document).on("ajaxSuccess", ".js-unsubscribe-from-newsletter form", function() {
            return $(".js-unsubscribe-from-newsletter .message").toggle()
        }), $(document).on("click", ".js-show-new-ssh-key-form", function() {
            return $(".js-new-ssh-key-box").toggle().find(".js-ssh-key-title").focus(), !1
        }), $(document).on("click", ".js-revoke-access", function() {
            var t, e, n, i, s;
            return i = $(this).data("id"), s = $(this).data("type"), e = $(this).siblings(".js-delete-failed").addClass("hidden"), n = "[data-type=" + s + "][data-id=" + i + "]", t = $(".js-revoke-item").filter(n), $.ajax({
                url: $(this).data("path"),
                type: "DELETE",
                success: function() {
                    return $.facebox.close(), t.remove()
                },
                error: function() {
                    return e.removeClass("hidden")
                }
            }), !1
        }), $(document).on("click", ".js-delete-oauth-application-image", function() {
            var t, e, n;
            return t = $(this).closest(".js-uploadable-container"), t.removeClass("has-uploaded-logo"), e = t.find("img.js-image-field"), n = t.find("input.js-oauth-application-logo-id"), e.attr("src", ""), n.val(""), !1
        }), $(document).on("click", ".js-new-callback", function(t) {
            var e, n;
            return t.preventDefault(), e = $(t.currentTarget).closest(".js-callback-urls"), n = e.find(".js-callback-url").first().clone(), n.removeClass("is-default-callback"), n.find("input").val(""), e.addClass("has-many"), $(t.currentTarget).before(n)
        }), $(document).on("click", ".js-delete-callback", function(t) {
            var e, n;
            return t.preventDefault(), e = $(t.currentTarget).closest(".js-callback-urls"), $(t.currentTarget).closest(".js-callback-url").remove(), n = e.find(".js-callback-url"), n.length <= 1 ? e.removeClass("has-many") : void 0
        }), $(document).on("change", '.js-oauth-application-whitelist input[type="radio"]', function() {
            switch ($(".js-policy-change").addClass("hidden"), $(this).val()) {
                case "approved":
                    return $(".js-policy-approved").toggleClass("hidden");
                case "denied":
                    return $(".js-policy-denied").toggleClass("hidden");
                case "off":
                    return $(".js-policy-off").toggleClass("hidden");
                case "on":
                    return $(".js-policy-on").toggleClass("hidden")
            }
        }), $(document).on("ajaxSuccess", ".js-org-application-access-form", function() {
            return window.location.reload()
        }), $(document).on("click", ".section-head", function() {
            return $(".section-nav").slideUp(200).addClass("collapsed"), $(this).next(".section-nav").slideDown(200).removeClass("collapsed")
        }), $(document).on("click", ".js-user-rename-warning-continue", function() {
            return $(".js-user-rename-warning, .js-user-rename-form").toggle(), !1
        })
    }.call(this),
    function() {
        $(function() {
            return $(".js-email-notice-trigger").focus(function() {
                return $(".js-email-notice").addClass("notice-highlight")
            }), $(".js-email-notice-trigger").blur(function() {
                return $(".js-email-notice").removeClass("notice-highlight")
            })
        }), $.observe(".js-plan-choice:checked", {
            add: function() {
                return $(this).closest(".plan-row").addClass("selected")
            },
            remove: function() {
                return $(this).closest(".plan-row").removeClass("selected")
            }
        }), $.observe(".js-plan-row.selected", {
            add: function() {
                var t;
                return t = $(this).find(".js-choose-button"), t.text(t.attr("data-selected-text"))
            },
            remove: function() {
                var t;
                return t = $(this).find(".js-choose-button"), t.text(t.attr("data-default-text"))
            }
        }), $.observe(".js-plan-row.free-plan.selected", {
            add: function() {
                var t;
                return t = $("#js-signup-billing-fields"), t.data("contents", t.contents().detach())
            },
            remove: function() {
                var t, e;
                return t = $("#js-signup-billing-fields"), e = t.data("contents"), t.append(e)
            }
        }), $.observe(".js-setup-organization:checked", {
            add: function() {
                var t;
                return t = $(".js-choose-plan-submit"), t.attr("data-default-text") || t.attr("data-default-text", t.text()), t.text(t.attr("data-org-text"))
            },
            remove: function() {
                var t;
                return t = $(".js-choose-plan-submit"), t.text(t.attr("data-default-text"))
            }
        })
    }.call(this),
    function() {
        $(document).on("click", ".js-approve-ssh-key", function() {
            var t;
            return t = $(this), t.addClass("disabled").find("span").text("Approving\u2026"), $.ajax({
                url: t.attr("href"),
                type: "POST",
                success: function() {
                    return t.parents("li").addClass("approved")
                },
                error: function() {
                    return t.removeClass("disabled").find("span").text("Error. Try Again")
                }
            }), !1
        }), $(document).on("click", ".js-reject-ssh-key", function() {
            var t;
            return t = $(this), t.addClass("disabled").find("span").text("Rejecting\u2026"), $.ajax({
                url: t.attr("href"),
                type: "DELETE",
                success: function() {
                    return t.parents("li").addClass("rejected")
                },
                error: function() {
                    return t.removeClass("disabled").find("span").text("Error. Try Again")
                }
            }), !1
        })
    }.call(this),
    function() {
        !$.support.pjax || location.search || location.hash || $(function() {
            var t, e, n;
            return t = null != (n = document.getElementById("issues-dashboard")) ? n : document.getElementById("issues_list"), (e = $(t).attr("data-url")) ? window.history.replaceState(null, document.title, e) : void 0
        })
    }.call(this),
    function() {
        $.hashChange(function() {
            var t, e;
            if (location.hash && !document.querySelector(":target")) return t = "user-content-" + location.hash.slice(1), e = document.getElementsByName(t)[0], null != e ? e.scrollIntoView() : void 0
        })
    }.call(this), $(function() {
        function t() {
            var n = $("#current-version").val();
            n && $.get("_current", function(i) {
                n == i ? setTimeout(t, 5e3) : e || ($("#gollum-error-message").text("Someone has edited the wiki since you started. Please reload this page and re-apply your changes."), $("#gollum-error-message").show(), $("#gollum-editor-submit").attr("disabled", "disabled"), $("#gollum-editor-submit").attr("value", "Cannot Save, Someone Else Has Edited"))
            })
        }
        var e = !1;
        $("#gollum-editor-body").each(t), $("#gollum-editor-submit").click(function() {
            e = !0
        })
    });