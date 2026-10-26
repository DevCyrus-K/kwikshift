/*===================================================
    Template Scripts
====================================================*/
(function ($) {
    "use strict";

    var apiBase = (typeof AppConfig !== "undefined" && AppConfig.apiBase ? AppConfig.apiBase : "").replace(/\/+$/, "");
    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function normalizePhoneHref(value) {
        var normalized = String(value || "").replace(/[^\d+]/g, "");

        return normalized ? "tel:" + normalized : "";
    }

    function applyPublicSettings(settings) {
        var phone = settings.phone || "";
        var secondaryPhone = settings.phone_secondary || phone;
        var email = settings.email || "";

        window.KWIKSHIFT_PUBLIC_SETTINGS = settings;

        $('a[href^="tel:"]').each(function (index) {
            var value = index === 0 ? phone : secondaryPhone;
            var href = normalizePhoneHref(value);

            if (href) {
                this.href = href;
            }

            if ($.trim($(this).text()).match(/[0-9+]/)) {
                $(this).text(value);
            }
        });

        $('a[href^="mailto:"]').each(function () {
            if (!email) {
                return;
            }

            this.href = "mailto:" + email;
            if ($.trim($(this).text()).indexOf("@") !== -1) {
                $(this).text(email);
            }
        });

        if (settings.whatsapp_url) {
            $('a[href*="wa.me"], a[href*="whatsapp"]').attr({
                href: settings.whatsapp_url,
                target: "_blank",
                rel: "noopener noreferrer"
            });
        }

        if (settings.facebook_url) {
            $('a[href*="facebook.com"]').attr("href", settings.facebook_url);
        }

        if (settings.instagram_url) {
            $('a[href*="instagram.com"]').attr("href", settings.instagram_url);
        }

        if (settings.linkedin_url) {
            $('a[href*="linkedin.com"]').attr("href", settings.linkedin_url);
        }

        injectOrganizationSchema(settings);
    }

    function injectOrganizationSchema(settings) {
        var script = document.getElementById("dynamic-organization-jsonld");
        var sameAs = [
            settings.facebook_url,
            settings.instagram_url,
            settings.linkedin_url,
            settings.whatsapp_url
        ].filter(function (value) {
            return !!value;
        });

        if (!script) {
            script = document.createElement("script");
            script.type = "application/ld+json";
            script.id = "dynamic-organization-jsonld";
            document.head.appendChild(script);
        }

        script.text = JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MovingCompany",
            "name": settings.name || "Kwikshift Movers",
            "url": "https://www.kwikshiftmovers.co.ke",
            "logo": "https://www.kwikshiftmovers.co.ke/assets/img/logo.png",
            "contactPoint": {
                "@type": "ContactPoint",
                "telephone": settings.phone || "+254112587581",
                "contactType": "customer service"
            },
            "address": {
                "@type": "PostalAddress",
                "streetAddress": settings.address || "",
                "addressCountry": "KE"
            },
            "sameAs": sameAs
        });
    }

    function loadPublicSettings() {
        $.ajax({
            url: apiBase + "/settings/public",
            method: "GET",
            dataType: "json",
            cache: true,
            timeout: 10000
        }).done(function (response) {
            if (response && (response.ok === true || response.success === true) && response.data) {
                applyPublicSettings(response.data);
            }
        });
    }

    // Smooth Animation
    if (!reduceMotion && window.innerWidth > 991 && typeof window.Lenis === "function") {
        const lenis = new window.Lenis({
            smooth: true,
            lerp: 0.08,
            gestureOrientation: "vertical",
            normalizeWheel: true,
            smoothTouch: false,
            touchMultiplier: 1.5
        });

        lenis.on('scroll', function () {});
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }

    // Preloader
    $(window).on('load', function () {
        var preloader = $('#preloader-wrap');

        if (!preloader.length) {
            return;
        }

        window.setTimeout(function () {
            preloader.fadeOut(180, function () {
                preloader.remove();
            });
        }, 120);
    });

    $(document).ready(function () {

        var html = $('html');
        html.removeClass('no-js').addClass('js');
        loadPublicSettings();

        // Animation Effect
        function textAnimation() {
            var deviceWidth = window.innerWidth || document.documentElement.clientWidth || 1200;

            if (!window.gsap || !window.SplitType || !window.ScrollTrigger) {
                return;
            }

            let elSectionHeadings = gsap.utils.toArray(".section-heading");
            elSectionHeadings.forEach(elSection => {
                let textAnimations = gsap.utils.toArray(elSection.getElementsByClassName("text-anim"));
                let borderAnim = gsap.utils.toArray(elSection.getElementsByClassName("border-anim"));
                textAnimations.forEach((textAnim, i) => {
                    let hl = textAnim.getElementsByClassName("hl");
                    let target = textAnim;
                    let effect = "effect-3d",
                        duration = 1,
                        delay = 0.3,
                        split = "none",
                        ease = "Back.easeOut",
                        trigger = textAnim,
                        stagger = 0.3;
                    if (textAnim.getAttribute("data-effect")) {
                        effect = textAnim.getAttribute("data-effect");
                    }
                    if (textAnim.getAttribute("data-duration")) {
                        duration = textAnim.getAttribute("data-duration");
                    }
                    if (textAnim.getAttribute("data-delay")) {
                        delay = textAnim.getAttribute("data-delay");
                    }
                    if (textAnim.getAttribute("data-stagger")) {
                        stagger = textAnim.getAttribute("data-stagger");
                    }
                    if (textAnim.getAttribute("data-split")) {
                        split = textAnim.getAttribute("data-split");
                    }
                    if (textAnim.getAttribute("data-ease")) {
                        ease = textAnim.getAttribute("data-ease");
                    }
                    if (textAnim.getAttribute("data-scroll-trigger")) {
                        trigger = textAnim.getAttribute("data-scroll-trigger");
                    }
                    if ("none" != split && !textAnim.dataset.splitReady) {
                        new SplitType(textAnim, {
                            types: 'chars, words, lines'
                        });
                        textAnim.dataset.splitReady = "true";
                    }

                    if ("none" != split) {
                        target = textAnim.getElementsByClassName(split);
                    }

                    const tl = gsap.timeline({
                        scrollTrigger: {
                            trigger: trigger,
                            scrub: false,
                            markers: false,
                            toggleActions: "play none none none",
                            start: "top 90%"
                        }
                    });

                    if ('effect-3d' === effect) {
                        gsap.set(textAnim, {
                            perspective: 400
                        });
                        tl.from(textAnim.getElementsByClassName(split), {
                            duration: duration,
                            delay: delay,
                            opacity: 0,
                            rotationX: -80,
                            force3D: true,
                            transformOrigin: "top center -50",
                            stagger: 0.1
                        });
                    }

                    if ('clip-text' === effect) {
                        gsap.set(textAnim, {
                            overflow: "hidden"
                        });
                        gsap.set(textAnim.getElementsByClassName('line'), {
                            overflow: "hidden"
                        });
                        tl.from(textAnim.getElementsByClassName(split), {
                            duration: duration,
                            delay: delay,
                            opacity: 0,
                            rotationX: -80,
                            force3D: true,
                            transformOrigin: "top center -50",
                            stagger: 0.1
                        });
                    }

                    if ('fade-in' === effect) {
                        if (deviceWidth < 1023) {
                            gsap.set(textAnim, {
                                opacity: 0,
                                y: 60
                            });
                            tl.to(target, {
                                opacity: 1,
                                y: 0,
                                duration: duration,
                                delay: delay * i,
                                ease: ease
                            });
                        } else {
                            gsap.set(target, {
                                opacity: 0,
                                y: 40
                            })
                            tl.to(target, {
                                opacity: 1,
                                y: 0,
                                duration: duration,
                                ease: ease,
                                delay: delay * i,
                                stagger: 0.3
                            });
                        }
                    }
                    if ('fade-in-left' === effect) {
                        gsap.set(target, {
                            x: -20,
                            opacity: 0,
                        });
                        tl.to(target, {
                            x: 0,
                            opacity: 1,
                            ease: ease,
                            duration: duration,
                            delay: delay * i,
                            stagger: {
                                each: 0.02,
                            }
                        });
                    }

                    if ('fade-in-right' === effect) {
                        gsap.set(target, {
                            x: 50,
                            opacity: 0,
                        });
                        tl.to(target, {
                            x: 0,
                            opacity: 1,
                            ease: ease,
                            duration: duration,
                            delay: delay * i,
                            stagger: {
                                each: 0.02,
                            }
                        });
                    }

                    if ('fade-in-top' === effect) {
                        gsap.set(target, {
                            y: -20,
                            opacity: 0,
                        });
                        tl.to(target, {
                            y: 0,
                            opacity: 1,
                            ease: ease,
                            duration: duration,
                            delay: delay * i,
                            stagger: {
                                each: 0.02,
                            }
                        });
                    }

                    if ('fade-in-bottom' === effect) {
                        gsap.set(target, {
                            y: 20,
                            opacity: 0,
                        });
                        tl.to(target, {
                            y: 0,
                            opacity: 1,
                            ease: ease,
                            duration: duration,
                            delay: delay * i,
                            stagger: {
                                each: stagger,
                            }
                        });
                    }

                    if ('zoom-in' === effect) {
                        gsap.set(target, {
                            opacity: 0,
                            scale: 0.5
                        });
                        tl.to(target, {
                            opacity: 1,
                            scale: 1,
                            x: 20,
                            ease: ease,
                            duration: duration,
                            delay: delay * i,
                            stagger: {
                                each: 0.3
                            }
                        });
                    }

                    if (hl.length) {
                        tl.to(hl, {
                        ["--hl-bd-width"]: "100%",
                            ease: "power1.in",
                            duration: 0.8,
                            delay: 0.2,
                            stagger: {
                                each: 0.02,
                            }
                        }, "-=1");
                    }
                });

                borderAnim.forEach(borderAnim => {
                    let bdLine = borderAnim.getElementsByClassName('sh-underline'),
                        dbTruck = borderAnim.getElementsByClassName('sh-truck');
                    gsap.set(bdLine, {
                        width: "0%"
                    });
                    gsap.set(dbTruck, {
                        opacity: 0,
                        right: "20px"
                    });

                    let shTl = gsap.timeline({
                        scrollTrigger: {
                            trigger: borderAnim,
                            start: "top 90%",
                            toggleActions: "play none none none"
                        }
                    });

                    shTl.to(bdLine, {
                        width: "100%",
                        duration: 1,
                        ease: "power1.in"
                    });

                    shTl.to(dbTruck, {
                        opacity: 1,
                        right: 0,
                        duration: 1,
                        delay: -0.08,
                        ease: "Back.easeOut"
                    });

                });
            });
        }

        // Responsive Classes
        function responsiveClasses() {
            var body = $("body");
            if ($(window).width() < 992) {
                body.removeClass("viewport-lg");
                body.addClass("viewport-sm");
            } else {
                body.removeClass("viewport-sm");
                body.addClass("viewport-lg");
            }
        }

        // Window Resize
        $(window).on("resize", function () {
            responsiveClasses();
        }).resize();

        // Sticky Header
        function stickyHeader() {
            var mainHeader = $(".main-header"),
                headerClone = mainHeader.clone();
            mainHeader.after('<div class="sticky-header"></div>');
            $(".sticky-header").html(headerClone);

            var headerSelector = document.querySelector(".sticky-header"),
                triggerPoint = mainHeader.height(),
                yOffset = 0;

            $(window).on("scroll", function () {
                yOffset = $(window).scrollTop();
                if (yOffset >= triggerPoint) {
                    $(".sticky-header").addClass("sticky-fixed-top");
                } else {
                    $(".sticky-header").removeClass("sticky-fixed-top");
                }
            });
        }

        if ($(window).width() > 0) {
            stickyHeader();
        }

        // Mobile Menu
        function mobileMenu() {
            var mainHeader = $("header.main-header").first();
            var menuWrapper = mainHeader.find(".header-menu-wrap .nav-menu").first().clone();
            var logoWrapper = mainHeader.find(".site-logo").first().clone();
            var mobileMenuMarkup = [
                '<div class="mobile-navigation-menu">',
                    '<div class="mobile-navigation-menu__header">',
                        '<div class="mobile-navigation-menu__brand"></div>',
                        '<button id="mobile-menu-close" aria-label="Close navigation menu"><i class="fa-regular fa-xmark"></i></button>',
                    '</div>',
                '</div>'
            ].join("");

            if (!mainHeader.length || !menuWrapper.length || $('.mobile-navigation-menu').length) {
                return;
            }

            mainHeader.after(mobileMenuMarkup);

            if (logoWrapper.length) {
                $('.mobile-navigation-menu__brand').append(logoWrapper);
            }

            $('.mobile-navigation-menu__header').after(menuWrapper);

            $("#mobile-menu-close, .mobile-menu-icon").on("click", function () {
                $(".mobile-menu-icon").toggleClass("menu-open");
                if ($(".mobile-menu-icon").hasClass("menu-open")) {
                    $(".mobile-menu-icon i").removeClass("fa-bars").addClass("fa-xmark");
                } else {
                    $(".mobile-menu-icon i").removeClass("fa-xmark").addClass("fa-bars");
                }
                $(".mobile-navigation-menu").toggleClass("open-mobile-menu");
            });

            $(".mobile-navigation-menu ul li:has(ul)").each(function () {
                $(this).append('<span class="dropdown-plus"></span>');
                $(this).addClass("dropdown_menu");
            });

            $(".mobile-navigation-menu .dropdown-plus").on("click", function () {
                $(this).prev("ul").slideToggle(300);
                $(this).toggleClass("dropdown-open");
                $(this).parent().toggleClass("dropdown-open");
            });
        }

        mobileMenu();

        function ensureCookieConsentSupport() {
            var hasCookieStyles = document.querySelector('link[href*="cookie-consent.css"]');

            if (!hasCookieStyles && document.head) {
                var stylesheet = document.createElement("link");
                stylesheet.rel = "stylesheet";
                stylesheet.href = "assets/css/cookie-consent.css";
                document.head.appendChild(stylesheet);
            }

            if (window.KwikshiftCookieConsent && typeof window.KwikshiftCookieConsent.init === "function") {
                window.KwikshiftCookieConsent.init();
                return;
            }

            if (document.querySelector('script[data-cookie-consent-loader="dynamic"]')) {
                return;
            }

            var script = document.createElement("script");
            script.src = "assets/js/cookie-consent.js";
            script.setAttribute("data-cookie-consent-loader", "dynamic");
            document.body.appendChild(script);
        }

        ensureCookieConsentSupport();

        // Popup Search Box
        $(function () {
            $("#popup-search-box").removeClass("toggled");
            $("body").removeClass("open-search-box");
            $(".dl-search-icon").on("click", function (e) {
                e.stopPropagation();
                $("body").toggleClass("open-search-box");
                $("#popup-search").focus();
            });

            $("#popup-search-box input").on("click", function (e) {
                e.stopPropagation();
            });
            $(document).on(
                "click",
                ".search-close, #searchbox-overlay",
                function (e) {
                    e.preventDefault();
                    $("body.open-search-box").removeClass("open-search-box");
                }
            );
        });

        //Running Animated Text
        const scrollers = document.querySelectorAll(".scroller");

        if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            addAnimation();
        }

        function addAnimation() {
            scrollers.forEach((scroller) => {
                scroller.setAttribute("data-animated", true);

                const scrollerInner = scroller.querySelector(".scroller__inner");

                if (!scrollerInner) {
                    return;
                }

                const scrollerContent = Array.from(scrollerInner.children);

                scrollerContent.forEach((item) => {
                    const duplicatedItem = item.cloneNode(true);
                    duplicatedItem.setAttribute("aria-hidden", true);
                    scrollerInner.appendChild(duplicatedItem);
                });
            });
        }

        function initProjectCarousel() {
            var carouselElement = document.querySelector(".project-carousel");
            var carouselWrapper = carouselElement ? carouselElement.closest(".swiper-outside") : null;
            var options = {
                slidesPerView: 3,
                spaceBetween: 20,
                slidesPerGroup: 1,
                loop: true,
                autoplay: false,
                speed: 600, // Slowed down from 400
                breakpoints: {
                    320: {
                        slidesPerView: 1,
                        slidesPerGroup: 1,
                        spaceBetween: 25
                    },
                    767: {
                        slidesPerView: 2,
                        slidesPerGroup: 1,
                        spaceBetween: 30
                    },
                    1024: {
                        slidesPerView: 4,
                        slidesPerGroup: 1
                    }
                }
            };

            if (!carouselElement || typeof Swiper !== "function" || !carouselElement.querySelector(".swiper-slide")) {
                return null;
            }

            if (carouselElement.querySelector(".carousel-pagination")) {
                options.pagination = {
                    el: carouselElement.querySelector(".carousel-pagination"),
                    clickable: true,
                };
            }

            if (carouselWrapper && carouselWrapper.querySelector(".swiper-next") && carouselWrapper.querySelector(".swiper-prev")) {
                options.navigation = {
                    nextEl: carouselWrapper.querySelector(".swiper-next"),
                    prevEl: carouselWrapper.querySelector(".swiper-prev")
                };
            }

            if (carouselElement.swiper && typeof carouselElement.swiper.destroy === "function") {
                carouselElement.swiper.destroy(true, true);
            }

            return new Swiper(carouselElement, options);
        }

        function initTestimonialCarousel() {
            var carouselElement = document.querySelector(".testimonial-carousel");
            var carouselWrapper = carouselElement ? carouselElement.closest(".swiper-outside") : null;
            var options = {
                slidesPerView: 2,
                spaceBetween: 20,
                slidesPerGroup: 1,
                loop: true,
                autoplay: false,
                speed: 600, // Slowed down from 400
                breakpoints: {
                    320: {
                        slidesPerView: 1,
                        slidesPerGroup: 1,
                        spaceBetween: 25
                    },
                    767: {
                        slidesPerView: 1,
                        slidesPerGroup: 1,
                        spaceBetween: 30
                    },
                    1024: {
                        slidesPerView: 2,
                        slidesPerGroup: 1
                    }
                }
            };

            if (!carouselElement || typeof Swiper !== "function" || !carouselElement.querySelector(".swiper-slide")) {
                return null;
            }

            if (carouselElement.querySelector(".carousel-pagination")) {
                options.pagination = {
                    el: carouselElement.querySelector(".carousel-pagination"),
                    clickable: true,
                };
            }

            if (carouselWrapper && carouselWrapper.querySelector(".swiper-next") && carouselWrapper.querySelector(".swiper-prev")) {
                options.navigation = {
                    nextEl: carouselWrapper.querySelector(".swiper-next"),
                    prevEl: carouselWrapper.querySelector(".swiper-prev")
                };
            }

            if (carouselElement.swiper && typeof carouselElement.swiper.destroy === "function") {
                carouselElement.swiper.destroy(true, true);
            }

            return new Swiper(carouselElement, options);
        }

        function initSponsorCarousel() {
            var carouselElement = document.querySelector(".sponsor-carousel");
            var options = {
                spaceBetween: 60,
                slidesPerGroup: 1,
                loop: true,
                autoplay: true,
                speed: 1500,
                breakpoints: {
                    320: {
                        slidesPerView: 2,
                        slidesPerGroup: 1,
                        spaceBetween: 20
                    },
                    767: {
                        slidesPerView: 2,
                        slidesPerGroup: 1,
                        spaceBetween: 50
                    },
                    1024: {
                        slidesPerView: 5,
                        slidesPerGroup: 1
                    }
                }
            };

            if (!carouselElement || typeof Swiper !== "function" || !carouselElement.querySelector(".swiper-slide")) {
                return null;
            }

            if (carouselElement.querySelector(".swiper-pagination")) {
                options.pagination = {
                    el: carouselElement.querySelector(".swiper-pagination"),
                    clickable: true,
                };
            }

            if (carouselElement.swiper && typeof carouselElement.swiper.destroy === "function") {
                carouselElement.swiper.destroy(true, true);
            }

            return new Swiper(carouselElement, options);
        }

        function initVenoBox() {
            if (typeof $.fn.venobox !== "function") {
                return;
            }

            $('.venobox').venobox({
                bgcolor: 'transparent',
                spinner: 'spinner-pulse',
                numeration: true,
                infinigall: true
            });
        }

        function initWow() {
            if (typeof WOW === "function") {
                new WOW().init();
            }
        }

        window.KwikshiftUi = window.KwikshiftUi || {};
        window.KwikshiftUi.initProjectCarousel = initProjectCarousel;
        window.KwikshiftUi.initTestimonialCarousel = initTestimonialCarousel;
        window.KwikshiftUi.initSponsorCarousel = initSponsorCarousel;
        window.KwikshiftUi.initVenoBox = initVenoBox;
        window.KwikshiftUi.initWow = initWow;

        initProjectCarousel();
        initTestimonialCarousel();
        initSponsorCarousel();

        // Accordion
        $(document).on('click', '.faq-accordion .accordion-item', function () {
            var accordion = $(this).closest('.faq-accordion');
            accordion.find('.accordion-item.active').removeClass('active');
            $(this).addClass('active');
        });

        // Funfact Counter
        if ($.fn.waypoint && $('.counter-item').length) {
            $('.counter-item').waypoint(
                function () {
                    var odo = $(".counter-item .odometer");
                    odo.each(function () {
                        var countNumber = $(this).attr("data-count");
                        $(this).html(countNumber);
                    });
                }, {
                    offset: "80%",
                    triggerOnce: true
                }
            );
        }

        //Gsap Text Animation
        textAnimation();

        // Wow JS Active
        initWow();

        // Nice Select Active
        if ($.fn.niceSelect) {
            $('select').niceSelect();
        }

        // Current Year
        var currentYear = new Date().getFullYear();
        // Hero Slider
        if (typeof Swiper === "function" && document.querySelector('.hero-slider')) {
            new Swiper('.hero-slider', {
                loop: true,
                autoplay: {
                    delay: 5000,
                    disableOnInteraction: false,
                },
                pagination: {
                    el: '.hero-pagination',
                    clickable: true,
                    dynamicBullets: true,
                },
                effect: 'fade',
                fadeEffect: {
                    crossFade: true
                },
                speed: 900
            });
        }

        $('#currentYear').append(currentYear);

        // Scrool To Top
        var scrollTop = $("#scroll-top");
        $(window).on('scroll', function () {
            var topPos = $(this).scrollTop();
            if (topPos > 100) {
                $('#scrollup').removeClass('hide');
                $('#scrollup').addClass('show');

            } else {
                $('#scrollup').removeClass('show');
                $('#scrollup').addClass('hide');
            }
        });

        scrollTop.on("click", function () {
            document.documentElement.scrollTo({
				top: 0,
				behavior: "smooth"
			});
        });

        // Custom Cursor
        function customCursor() {
            $('body').append('<div class="dl-cursor"></div>');
            var cursor = $('.dl-cursor'),
                projectView = $('.project-view');

            $(window).on('mousemove', function (e) {
                cursor.css({
                    'transform': 'translate(' + (e.clientX - 5) + 'px,' + (e.clientY - 5) + 'px)',
                    'visibility': 'inherit'
                });
            });

            $(window).on('mouseout', function () {
                cursor.css('visibility', 'hidden');
            });
            projectView.each(function () {
                $(this).on('mouseleave', function () {
                    cursor.removeClass('expand');
                });
                $(this).on('mouseover', function () {
                    cursor.addClass('expand');
                });
            });
        }

        if ($('body').hasClass('viewport-lg') && $('.project-view').length) {
            customCursor();
        }

        // Venobox Active
        initVenoBox();

    });

})(jQuery);
