(function ($) {
    "use strict";

    var apiBase = (typeof AppConfig !== "undefined" && AppConfig.apiBase ? AppConfig.apiBase : "").replace(/\/+$/, "");
    var apiEndpoints = {
        services: apiBase + "/services",
        testimonials: apiBase + "/testimonials",
        faqs: apiBase + "/faqs",
        gallery: apiBase + "/gallery",
        careers: apiBase + "/careers/jobs"
    };
    var contentCachePrefix = "kwikshift:public-content:";
    var contentCacheTtl = 60 * 1000;
    var localFallbackContent = {
        gallery: [
            { id: "local-residential-move", title: "Residential Relocation", category: "Residential Relocation", image_url: "assets/img/residential-moves.webp", alt_text: "Kwikshift Movers residential relocation service" },
            { id: "local-office-move", title: "Office Relocation", category: "Office Relocation", image_url: "assets/img/office-moving.webp", alt_text: "Kwikshift Movers office relocation service" },
            { id: "local-packing", title: "Careful Packing", category: "Packing & Storage", image_url: "assets/img/packing-storage.webp", alt_text: "Kwikshift Movers packing service" },
            { id: "local-long-distance", title: "Long-Distance Move", category: "Long-Distance Transport", image_url: "assets/img/long-distances-moves.webp", alt_text: "Kwikshift Movers long-distance moving service" },
            { id: "local-residential-packing", title: "Home Packing Support", category: "Residential Relocation", image_url: "assets/img/residential-packing.webp", alt_text: "Kwikshift Movers home packing support" },
            { id: "local-office-packing", title: "Office Packing", category: "Office Relocation", image_url: "assets/img/office-packing.webp", alt_text: "Kwikshift Movers office packing service" },
            { id: "local-storage", title: "Storage Solutions", category: "Packing & Storage", image_url: "assets/img/storage-packing-solutions.webp", alt_text: "Kwikshift Movers storage and packing solutions" },
            { id: "local-moving-team", title: "Moving Team", category: "Residential Relocation", image_url: "assets/img/delivery-men-2.webp", alt_text: "Kwikshift Movers team ready for a move" },
            { id: "local-team", title: "Move Planning", category: "Office Relocation", image_url: "assets/img/kwikshift-team.webp", alt_text: "Kwikshift Movers planning a relocation" }
        ],
        testimonials: [
            { id: "ramogi-oweke", anchor: "ramogi-oweke", client_name: "Ramogi Oweke", client_role: "Google review", use_initials: true, testimonial_message: "I recently used Kwikshift Movers for my house move, and they exceeded my expectations. The team was very courteous and arrived earlier than expected, which gave the day a genuinely positive start." },
            { id: "maurine-chepkemoi", anchor: "maurine-chepkemoi", client_name: "Maurine Chepkemoi", client_role: "Google review", use_initials: true, testimonial_message: "I genuinely enjoyed the experience and did not have to lift a finger. The Kwikshift team handled everything from packing and loading to unloading and arranging my new home, making the move easy and stress-free." },
            { id: "hyppolyte-oyoo", anchor: "hyppolyte-oyoo", client_name: "Hyppolyte Oyoo", client_role: "Google review", use_initials: true, testimonial_message: "I am deeply grateful to the Kwikshift team for work well done. During my move from Nairobi to Kisumu, the team showed exceptional professionalism and gave me confidence throughout the relocation." },
            { id: "noreen-kombo", anchor: "noreen-kombo", client_name: "Noreen Kombo", client_role: "Google review", use_initials: true, testimonial_message: "Professional service at a budget-friendly price. Communication was timely, and the team was very flexible in adapting to my moving requirements. I highly recommend them." },
            { id: "otiko-jairus", anchor: "otiko-jairus", client_name: "Otiko Jairus", client_role: "Google review", use_initials: true, testimonial_message: "I had a good moving experience from Nakuru to Nairobi. The team was professional and handled my belongings carefully. Although the arrival was later than expected, the overall service was smooth and satisfactory, and I would still recommend them." },
            { id: "alice-njoroge", anchor: "alice-njoroge", client_name: "Alice Njoroge", client_role: "Google review", use_initials: true, testimonial_message: "I highly recommend Kwikshift Movers. I appreciated the clear communication and consistent follow-up all the way to moving day. The team was kind, respectful, and made the whole process easier." },
            { id: "teckla-mutune", anchor: "teckla-mutune", client_name: "Teckla Mutune", client_role: "Google review", use_initials: true, testimonial_message: "I could not have been more impressed with the service. From my first contact, communication was clear, professional, and friendly. The moving team arrived on time and handled all my belongings with great care." },
            { id: "jackson-kiilu", anchor: "jackson-kiilu", client_name: "Jackson Kiilu", client_role: "Google review", use_initials: true, testimonial_message: "Very good service from Kwikshift Movers, with excellent and clear communication throughout the moving process." },
            { id: "kirui-charles", anchor: "kirui-charles", client_name: "KIRUI CHARLES", client_role: "Google review", use_initials: true, testimonial_message: "A great experience, even on less than 24 hours' notice. The staff were professional and courteous, and I would recommend Kwikshift Movers at any time." },
            { id: "mohamed-athman", anchor: "mohamed-athman", client_name: "Mohamed Athman", client_role: "Google review", use_initials: true, testimonial_message: "The team provided a fast and safe way to move my belongings. The service was efficient, and I felt my items were handled securely throughout." },
            { id: "emmanuel-kimathi", anchor: "emmanuel-kimathi", client_name: "Emmanuel Kimathi", client_role: "Google review", use_initials: true, testimonial_message: "Kwikshift Movers were on time and very professional. I do not regret choosing to work with the team." },
            { id: "rachael-nyaguthii", anchor: "rachael-nyaguthii", client_name: "Rachael Nyaguthii", client_role: "Google review", use_initials: true, testimonial_message: "Excellent service from a team that was ready to move me. I enjoyed every part of the moving exercise." },
            { id: "genevieve-ndinda", anchor: "genevieve-ndinda", client_name: "Genevieve Ndinda", client_role: "Google review", use_initials: true, testimonial_message: "As a recent customer, I must commend Kwikshift for their affordability, reliability, and professionalism throughout the entire process. Great work, and thank you very much." },
            { id: "esther-kadhengi", anchor: "esther-kadhengi", client_name: "Esther Kadhengi", client_role: "Google review", use_initials: true, testimonial_message: "The team was very respectful and well organised. I would recommend Kwikshift Movers at any time. Thank you." },
            { id: "katie-makumi", anchor: "katie-makumi", client_name: "Katie Makumi", client_role: "Google review", use_initials: true, testimonial_message: "A great, affordable, and reliable team. I have used Kwikshift Movers and would recommend them. Roy was respectful, and the overall experience was reassuring." },
            { id: "bridget-maina", anchor: "bridget-maina", client_name: "Bridget Maina", client_role: "Google review", use_initials: true, testimonial_message: "The team handled everything with care. I would highly recommend Kwikshift Movers to anyone planning a move." },
            { id: "stella-makiya", anchor: "stella-makiya", client_name: "Stella Makiya", client_role: "Google review", use_initials: true, testimonial_message: "A respectful and patient team to work with. They are excellent at what they do, and I appreciate their support." },
            { id: "zahraa-osman", anchor: "zahraa-osman", client_name: "Zahraa Osman", client_role: "Google review", use_initials: true, testimonial_message: "Good service that arrived on time, with good after-service as well. I highly recommend Kwikshift Movers." },
            { id: "laura-hunja", anchor: "laura-hunja", client_name: "Laura Hunja", client_role: "Google review", use_initials: true, testimonial_message: "Good service and an easy team to work with. Kwikshift Movers are a leading team." },
            { id: "ian-rono", anchor: "ian-rono", client_name: "Ian Rono", client_role: "Google review", use_initials: true, testimonial_message: "Excellent service and after-service. I would recommend Kwikshift Movers without hesitation." },
            { id: "tel-aviv-bor", anchor: "tel-aviv-bor", client_name: "Tel Aviv Bor", client_role: "Google review", use_initials: true, testimonial_message: "The team was professional, punctual, and moved quickly. The service was well organised from start to finish." },
            { id: "jaliding-kerubo", anchor: "jaliding-kerubo", client_name: "Jaliding Kerubo", client_role: "Google review", use_initials: true, testimonial_message: "Kwikshift Movers are the best movers. I would recommend them widely to anyone looking for relocation support." },
            { id: "chuchun-ayla", anchor: "chuchun-ayla", client_name: "Chuchun Ayla", client_role: "Google review", use_initials: true, testimonial_message: "A thoroughly professional and positive experience with Kwikshift Movers." },
            { id: "emma-ooko", anchor: "emma-ooko", client_name: "EMMA OOKO", client_role: "Google review", use_initials: true, testimonial_message: "Excellent service from a team I was happy to trust with my move." },
            { id: "samuel-sampuerap", anchor: "samuel-sampuerap", client_name: "Samuel Sampuerap", client_role: "Google review", use_initials: true, testimonial_message: "A truly amazing moving experience with Kwikshift Movers." },
            { id: "cindy-akinyi", anchor: "cindy-akinyi", client_name: "Cindy Akinyi", client_role: "Google review", use_initials: true, testimonial_message: "A very professional service and a team I was pleased to work with." },
            { id: "biko", anchor: "biko", client_name: "Biko", client_role: "Google review", use_initials: true, testimonial_message: "Exemplary service at its best. Kwikshift Movers delivered a highly positive experience." },
            { id: "alphonce-manje", anchor: "alphonce-manje", client_name: "Alphonce Manje", client_role: "Google review", use_initials: true, testimonial_message: "The move was well coordinated, orderly, and completed on time. I appreciated the organised approach from the team." },
            { id: "andia-diaspora-realtor", anchor: "andia-diaspora-realtor", client_name: "ANDIA Diaspora Realtor", client_role: "Google review", use_initials: true, testimonial_message: "A professional and thoroughly satisfactory experience with Kwikshift Movers." }
        ]
    };
    var faqPageItems = [];
    var faqSearchTimer = null;
    var queryParams = new URLSearchParams(window.location.search);

    // Clear old cached content on page load (cache invalidation)
    function clearStaleCache() {
        if (!window.sessionStorage) {
            return;
        }
        
        try {
            var now = Date.now();
            for (var i = sessionStorage.length - 1; i >= 0; i--) {
                var key = sessionStorage.key(i);
                if (key && key.startsWith(contentCachePrefix)) {
                    try {
                        var cached = JSON.parse(sessionStorage.getItem(key) || "null");
                        // If cache expired, remove it
                        if (cached && cached.expiresAt && now > cached.expiresAt) {
                            sessionStorage.removeItem(key);
                        }
                    } catch (e) {
                        sessionStorage.removeItem(key);
                    }
                }
            }
        } catch (error) {
            // Ignore storage errors
        }
    }

    $(function () {
        clearStaleCache();

        loadHomeProjects();
        loadHomeTestimonials();
        loadHomeSponsors();
        loadTestimonialsPage();
        loadClientsPage();
        loadServices();
        loadFaqAccordion("#home-faq-accordion", 4);
        loadFaqAccordion("#review-faq-accordion", 4);
        loadFaqPage();
        loadGalleryPage();
        loadCareersPage();
    });

    function fetchContent(type, options) {
        var endpoint = apiEndpoints[type];
        var requestData = cleanRequestData(options || {});
        var cacheKey = getContentCacheKey($.extend({ type: type }, requestData));
        var cached = readCachedContent(cacheKey, false);
        var fallback = readCachedContent(cacheKey, true);
        var request;
        var deferred;

        if (!endpoint) {
            return resolveLocalFallback(type, requestData);
        }

        if (cached) {
            return $.Deferred().resolve(cached).promise();
        }

        request = $.ajax({
            url: endpoint,
            method: "GET",
            dataType: "json",
            cache: true,
            data: requestData
        });

        request.done(function (response) {
            writeCachedContent(cacheKey, response);
        });

        deferred = $.Deferred();
        request.done(function (response) {
            deferred.resolve(response);
        }).fail(function () {
            var localFallback = fallback || getLocalFallback(type, requestData);

            if (localFallback) {
                deferred.resolve(localFallback);
                return;
            }

            deferred.reject();
        });

        return deferred.promise();
    }

    function cleanRequestData(data) {
        var cleaned = {};

        $.each(data, function (key, value) {
            if (value === null || value === undefined || value === "") {
                return;
            }

            cleaned[key] = value === "all" ? 500 : value;
        });

        return cleaned;
    }

    function resolveLocalFallback(type, requestData) {
        var fallback = getLocalFallback(type, requestData);

        return fallback
            ? $.Deferred().resolve(fallback).promise()
            : $.Deferred().reject().promise();
    }

    function getLocalFallback(type, requestData) {
        var items = localFallbackContent[type];
        var limit;

        if (!Array.isArray(items) || !items.length) {
            return null;
        }

        items = items.slice(0);

        if (requestData.category) {
            items = items.filter(function (item) {
                return String(item.category || "").toLowerCase() === String(requestData.category).toLowerCase();
            });
        }

        limit = parseInt(requestData.limit, 10);
        if (limit > 0) {
            items = items.slice(0, limit);
        }

        return {
            success: true,
            data: items,
            source: "local-fallback"
        };
    }

    function resolveImageUrl(item) {
        var localImage = item && (item.image_url || item.storage_url || item.thumbnail_url || item.image_path);

        if (localImage && (String(localImage).indexOf("assets/") === 0 || String(localImage).indexOf("/") === 0)) {
            return localImage;
        }

        if (typeof AppConfig !== "undefined" && AppConfig.resolvImageUrl) {
            return AppConfig.resolvImageUrl(item || {});
        }

        return (item && (item.image_url || item.storage_url || item.thumbnail_url || item.image_path)) || "assets/img/placeholder.jpg";
    }

    function resolveAvatarUrl(item) {
        if (item && item.use_initials) {
            return "";
        }

        var direct = item && (item.client_image || item.client_logo);

        if (direct && (String(direct).indexOf("http") === 0 || String(direct).indexOf("data:image/") === 0 || String(direct).indexOf("/") === 0)) {
            return direct;
        }

        return resolveImageUrl(item);
    }

    function getContentCacheKey(requestData) {
        return contentCachePrefix + Object.keys(requestData).sort().map(function (key) {
            return encodeURIComponent(key) + "=" + encodeURIComponent(String(requestData[key]));
        }).join("&");
    }

    function readCachedContent(cacheKey, allowExpired) {
        var cached;

        if (!window.sessionStorage) {
            return null;
        }

        try {
            cached = JSON.parse(window.sessionStorage.getItem(cacheKey) || "null");
        } catch (error) {
            return null;
        }

        if (!cached || !cached.payload || !cached.expiresAt) {
            return null;
        }

        if (!allowExpired && Date.now() > cached.expiresAt) {
            return null;
        }

        return cached.payload;
    }

    function writeCachedContent(cacheKey, payload) {
        if (!window.sessionStorage) {
            return;
        }

        try {
            window.sessionStorage.setItem(cacheKey, JSON.stringify({
                expiresAt: Date.now() + contentCacheTtl,
                payload: payload
            }));
        } catch (error) {
            // Storage can be unavailable in private browsing; the live request still works.
        }
    }

    function loadHomeProjects() {
        var wrapper = document.querySelector(".project-carousel .swiper-wrapper");

        if (!wrapper) {
            return;
        }

        fetchContent("gallery", {
            limit: 5
        }).done(function (response) {
            if (!hasItems(response)) {
                wrapper.innerHTML = renderCarouselEmptySlide("No gallery items available right now.", "Please check back soon for recent moves.");
                return;
            }

            wrapper.innerHTML = renderHomeProjectSlides(response.data, response.source !== "local-fallback");
            refreshProjectUi();
        }).fail(function () {
            wrapper.innerHTML = renderCarouselEmptySlide("Gallery unavailable right now.", "Please try again shortly.");
            refreshProjectUi();
        });
    }

    function loadHomeTestimonials() {
        var wrapper = document.querySelector(".testimonial-carousel .swiper-wrapper");

        if (!wrapper) {
            return;
        }

        fetchContent("testimonials", {
            limit: 4
        }).done(function (response) {
            if (!hasItems(response)) {
                wrapper.innerHTML = renderCarouselEmptySlide("No testimonials available right now.", "Please check back soon or share your review.");
                return;
            }

            wrapper.innerHTML = renderHomeTestimonialSlides(response.data);
            refreshTestimonialUi();
        }).fail(function () {
            wrapper.innerHTML = renderCarouselEmptySlide("Testimonials unavailable right now.", "Please try again shortly.");
            refreshTestimonialUi();
        });
    }

    function loadHomeSponsors() {
        var wrapper = document.querySelector(".sponsor-carousel .swiper-wrapper");

        if (!wrapper) {
            return;
        }

        $(wrapper).closest("section").hide();
    }

    function loadTestimonialsPage() {
        var grid = $("#testimonial-reviews-grid");
        var featuredFilter = getBooleanFilter("featured");
        var serviceTypeFilter = getStringFilter("service_type");

        if (!grid.length) {
            return;
        }

        fetchContent("testimonials", {
            limit: "all",
            featured: featuredFilter,
            service_type: serviceTypeFilter
        }).done(function (response) {
            if (!hasItems(response)) {
                grid.html(renderGridEmptyState("No testimonials available right now.", "Please check back soon or share your review."));
                return;
            }

            // client-side pagination for testimonials
            var items = response.data || [];
            var pageSize = 6;
            renderPaginatedGrid(items, pageSize, grid, renderTestimonialsGrid, "testimonials-pagination");
            callUi("initWow");
        }).fail(function () {
            grid.html(renderTestimonialsFallbackGrid());
            $("#testimonials-pagination").hide();
        });
    }

    function loadClientsPage() {
        var grid = $("#client-reviews-grid");

        if (!grid.length) {
            return;
        }

        grid.closest("section").hide();
    }

    function loadFaqAccordion(selector, limit) {
        var accordion = $(selector);

        if (!accordion.length) {
            return;
        }

        fetchContent("faqs", {
            limit: limit
        }).done(function (response) {
            if (!hasItems(response)) {
                accordion.html(renderAccordionEmptyState("No FAQs available right now.", "Please contact our team for direct help."));
                return;
            }

            accordion.html(renderFaqAccordion(response.data, selector.replace("#", "")));
        }).fail(function () {
            accordion.html(renderAccordionEmptyState("FAQs unavailable right now.", "Please try again shortly."));
        });
    }

    function loadFaqPage() {
        var accordion = $("#faq-accordion");
        var searchInput = $("#faq-search-input");
        var categoryFilter = getStringFilter("category");

        if (!accordion.length) {
            return;
        }

        fetchContent("faqs", {
            limit: "all",
            category: categoryFilter
        }).done(function (response) {
            if (!hasItems(response)) {
                faqPageItems = [];
                accordion.html(renderAccordionEmptyState("No FAQs available right now.", "Please contact our team for direct help."));
                return;
            }

            faqPageItems = response.data.slice(0);
            accordion.html(renderFaqAccordion(faqPageItems, "faq-accordion"));
            injectFaqJsonLd(faqPageItems);
            bindFaqSearch(searchInput, accordion);
        }).fail(function () {
            faqPageItems = [];
            accordion.html(renderAccordionEmptyState("FAQs unavailable right now.", "Please try again shortly."));
        });
    }

    function loadGalleryPage() {
        var grid = $("#gallery-grid");
        var featuredFilter = getBooleanFilter("featured");
        var categoryFilter = getStringFilter("category");

        if (!grid.length) {
            return;
        }

        fetchContent("gallery", {
            limit: "all",
            featured: featuredFilter,
            category: categoryFilter
        }).done(function (response) {
            if (!hasItems(response)) {
                grid.html(renderGridEmptyState("No gallery items available right now.", "Please check back soon for recent moving projects."));
                $("#gallery-pagination").hide();
                return;
            }


            var items = response.data || [];
            var pageSize = 9; // 3 columns x 3 rows
            renderPaginatedGrid(items, pageSize, grid, function (pageItems) {
                return renderGalleryGrid(pageItems, response.source !== "local-fallback");
            }, "gallery-pagination");
            callUi("initVenoBox");
            callUi("initWow");
            callUi("initGalleryImages");
        }).fail(function () {
            grid.html(renderGalleryFallbackGrid());
            $("#gallery-pagination").hide();
            callUi("initVenoBox");
            callUi("initWow");
            callUi("initGalleryImages");
        });
    }

    function loadCareersPage() {
        var listingsGrid = $("#careers-listings-grid");
        var departmentFilter = getStringFilter("department");

        if (!listingsGrid.length) {
            return;
        }

        fetchContent("careers", {
            limit: "all",
            department: departmentFilter
        }).done(function (response) {
            if (!hasItems(response)) {
                renderCareerEmptyState();
                return;
            }


            $("#careers-heading-title").html('Open Roles at <span class="hl">Kwikshift</span>');
            $("#careers-heading-copy").html("Apply securely online for our current openings in moving, transport, and operations support.");
            var items = response.data || [];
            var pageSize = 6;
            renderPaginatedGrid(items, pageSize, listingsGrid, renderCareerGrid, "careers-pagination");
            injectJobPostingJsonLd(items);
            callUi("initWow");
        }).fail(function () {
            renderCareerEmptyState("Careers unavailable right now.", "Please try again shortly or contact our team for updates.");
        });
    }

    function loadServices() {
        var grid = $("#services-grid");

        if (!grid.length) {
            return;
        }

        fetchContent("services").done(function (response) {
            if (!hasItems(response)) {
                grid.html(renderGridEmptyState("Services unavailable right now.", "Call or WhatsApp us and we will guide you directly."));
                return;
            }

            grid.html(renderServiceCards(response.data || []));
            callUi("initWow");
        }).fail(function () {
            grid.html(renderGridEmptyState("Services unavailable right now.", "Call or WhatsApp us and we will guide you directly."));
        });
    }

    // Generic pagination renderer for in-memory arrays
    function renderPaginatedGrid(items, pageSize, gridElement, renderPageFn, paginationId) {
        var total = Array.isArray(items) ? items.length : 0;
        var totalPages = Math.max(1, Math.ceil(total / pageSize));
        var currentPage = 1;

        function renderPage(page) {
            page = Math.max(1, Math.min(totalPages, page));
            var start = (page - 1) * pageSize;
            var end = start + pageSize;
            var slice = items.slice(start, end);
            gridElement.html(renderPageFn(slice));
            attachPagination(paginationId, totalPages, page);
            callUi("initGalleryImages");
        }

        renderPage(currentPage);

        // wire clicks
        $(document).off("click", "#" + paginationId + " a.page-link").on("click", "#" + paginationId + " a.page-link", function (e) {
            e.preventDefault();
            var p = parseInt($(this).attr("data-page"), 10) || 1;
            renderPage(p);
            // re-init UI behaviours for newly rendered items if any
            callUi("initWow");
            callUi("initVenoBox");
            callUi("initGalleryImages");
        });
    }

    function attachPagination(paginationId, totalPages, currentPage) {
        var container = $("#" + paginationId);
        if (!container.length) {
            // try to create container after grid if possible
            // fallback: insert to body end
            container = $("<ul class=\"pagination-wrap text-center mt-40\" id=\"" + paginationId + "\"></ul>");
            $("main, body, .container").first().append(container);
        }

        if (totalPages <= 1) {
            container.hide();
            return;
        }

        var html = "";
        for (var i = 1; i <= totalPages; i++) {
            html += '<li><a href="#" data-page="' + i + '" class="page-link ' + (i === currentPage ? 'active' : '') + '">' + i + '</a></li>';
        }

        container.html(html).show();
    }

    function bindFaqSearch(searchInput, accordion) {
        if (!searchInput.length) {
            return;
        }

        searchInput.off("input.kwikshiftFaqSearch").on("input.kwikshiftFaqSearch", function () {
            var value = $(this).val();

            if (faqSearchTimer) {
                window.clearTimeout(faqSearchTimer);
            }

            faqSearchTimer = window.setTimeout(function () {
                var term = String(value || "").toLowerCase().trim();
                var filteredItems;

                if (!term) {
                    accordion.html(renderFaqAccordion(faqPageItems, "faq-accordion"));
                    return;
                }

                filteredItems = faqPageItems.filter(function (item) {
                    return [
                        item.question,
                        item.answer,
                        item.category
                    ].join(" ").toLowerCase().indexOf(term) !== -1;
                });

                if (!filteredItems.length) {
                    accordion.html(renderAccordionEmptyState("No matching FAQs found.", "Try a different keyword or contact our team for direct help."));
                    return;
                }

                accordion.html(renderFaqAccordion(filteredItems, "faq-accordion"));
            }, 200);
        });
    }

    function renderHomeProjectSlides(items, animate) {
        return items.map(function (item, index) {
            var imageId = "home-project-img-" + item.id + "-" + Math.random().toString(36).substr(2, 9);
            var imageUrl = resolveImageUrl(item);
            var animationClass = animate === false ? "" : " wow fade-in-bottom";
            
            return [
                '<div class="swiper-slide">',
                    '<div class="project-item' + animationClass + '" data-wow-delay="' + escapeHtml(getDelay(index, 200)) + 'ms">',
                        '<div class="project-thumb project-view">',
                            '<div class="gallery-image-loader" id="loader-' + imageId + '">',
                                '<div class="gallery-image-skeleton"></div>',
                            '</div>',
                            '<a class="venobox" href="' + escapeHtml(imageUrl) + '" data-gall="projects">',
                                '<img id="' + imageId + '" class="gallery-image" loading="lazy" decoding="async" src="' + escapeHtml(imageUrl) + '" alt="' + escapeHtml(item.alt_text || item.title || "Kwikshift Movers project") + '">',
                            '</a>',
                        '</div>',
                        '<div class="project-content">',
                            '<a href="' + escapeHtml(getGalleryCategoryLink(item.category, true)) + '" class="category">' + escapeHtml(item.category) + '</a>',
                            '<h3><a href="' + escapeHtml(getGalleryCategoryLink(item.category, true)) + '">' + escapeHtml(item.title) + '</a></h3>',
                        '</div>',
                    '</div>',
                '</div>'
            ].join("");
        }).join("");
    }

    function renderHomeTestimonialSlides(items) {
        return items.map(function (item) {
            // Extract initials from client name
            var nameParts = item.client_name.split(' ');
            var initials = (nameParts[0].charAt(0) + (nameParts[1] ? nameParts[1].charAt(0) : '')).toUpperCase();
            
            // Check if image exists and is not empty
            var avatarUrl = resolveAvatarUrl(item);
            var hasImage = avatarUrl && avatarUrl.trim() !== '';
            var ratingMarkup = item.rating === undefined || item.rating === null || item.rating === ""
                ? ""
                : '<ul class="rattings" aria-label="Rated ' + escapeHtml(formatRating(item.rating)) + ' out of 5 stars">' + renderStars(item.rating) + '</ul>';
            var thumbContent = hasImage 
                ? '<img loading="lazy" decoding="async" src="' + escapeHtml(avatarUrl) + '" alt="' + escapeHtml(item.client_name) + ' testimonial photo">'
                : '<div class="avatar-initials" title="' + escapeHtml(item.client_name) + '">' + escapeHtml(initials) + '</div>';
            
            return [
                '<div class="swiper-slide">',
                    '<div class="testimonial-item">',
                        '<div class="testi-thumb testi-avatar">',
                            thumbContent,
                        '</div>',
                        '<div class="testi-content">',
                            '<div class="client-info">',
                                '<h3>' + escapeHtml(item.client_name) + ' <span>' + escapeHtml(item.client_role) + '</span></h3>',
                            '</div>',
                            '<p>' + escapeHtml(item.testimonial_message) + '</p>',
                            ratingMarkup,
                            '<div class="quote-icon"><i class="fa-sharp fa-solid fa-quote-right"></i></div>',
                        '</div>',
                    '</div>',
                '</div>'
            ].join("");
        }).join("");
    }

    function renderTestimonialsGrid(items) {
        return items.map(function (item) {
            // Extract initials from client name
            var nameParts = item.client_name.split(' ');
            var initials = (nameParts[0].charAt(0) + (nameParts[1] ? nameParts[1].charAt(0) : '')).toUpperCase();
            var avatarUrl = resolveAvatarUrl(item);
            var ratingMarkup = item.rating === undefined || item.rating === null || item.rating === ""
                ? ""
                : '<ul class="rattings" aria-label="Rated ' + escapeHtml(formatRating(item.rating)) + ' out of 5 stars">' + renderStars(item.rating) + '</ul>';
            var thumbContent = avatarUrl
                ? '<img loading="lazy" decoding="async" src="' + escapeHtml(avatarUrl) + '" alt="' + escapeHtml(item.client_name) + ' testimonial photo">'
                : '<div class="avatar-initials" title="' + escapeHtml(item.client_name) + '">' + escapeHtml(initials) + '</div>';
            
            return [
                '<div class="col-md-6" id="' + escapeHtml(item.anchor) + '">',
                    '<div class="testimonial-item">',
                        '<div class="testi-thumb testi-avatar">',
                            thumbContent,
                        '</div>',
                        '<div class="testi-content">',
                            '<div class="client-info">',
                                '<h3>' + escapeHtml(item.client_name) + ' <span>' + escapeHtml(item.client_role) + '</span></h3>',
                            '</div>',
                            '<p>' + escapeHtml(item.testimonial_message) + '</p>',
                            ratingMarkup,
                            '<div class="quote-icon"><i class="fa-sharp fa-solid fa-quote-right"></i></div>',
                        '</div>',
                    '</div>',
                '</div>'
            ].join("");
        }).join("");
    }

    function renderFaqAccordion(items, accordionId) {
        return items.map(function (item, index) {
            var headingId = accordionId + "-heading-" + item.id;
            var collapseId = accordionId + "-collapse-" + item.id;
            var isOpen = index === 0;

            return [
                '<div class="accordion-item' + (isOpen ? " active" : "") + '" data-faq-category="' + escapeHtml(item.category) + '">',
                    '<h2 class="accordion-header" id="' + escapeHtml(headingId) + '">',
                        '<button class="accordion-button' + (isOpen ? "" : " collapsed") + '" type="button" data-bs-toggle="collapse" data-bs-target="#' + escapeHtml(collapseId) + '" aria-expanded="' + (isOpen ? "true" : "false") + '" aria-controls="' + escapeHtml(collapseId) + '">' + escapeHtml(item.question) + '</button>',
                    '</h2>',
                    '<div id="' + escapeHtml(collapseId) + '" class="accordion-collapse collapse' + (isOpen ? " show" : "") + '" aria-labelledby="' + escapeHtml(headingId) + '" data-bs-parent="#' + escapeHtml(accordionId) + '">',
                        '<div class="accordion-body">',
                            "<p>" + escapeHtml(item.answer) + "</p>",
                        "</div>",
                    "</div>",
                "</div>"
            ].join("");
        }).join("");
    }

    function renderGalleryGrid(items, animate) {
        return items.map(function (item, index) {
            var link = getGalleryCategoryLink(item.category, false);
            var imageId = "gallery-img-" + item.id + "-" + Math.random().toString(36).substr(2, 9);
            var imageUrl = resolveImageUrl(item);
            var animationClass = animate === false ? "" : " wow fade-in-bottom";

            return [
                '<div class="col-md-4 col-sm-6">',
                    '<div class="project-item' + animationClass + '" data-wow-delay="' + escapeHtml(getDelay(index, 200)) + 'ms">',
                        '<div class="project-thumb project-view">',
                            '<div class="gallery-image-loader" id="loader-' + imageId + '">',
                                '<div class="gallery-image-skeleton"></div>',
                            '</div>',
                            '<a class="venobox" href="' + escapeHtml(imageUrl) + '" data-gall="projects">',
                                '<img id="' + imageId + '" class="gallery-image" loading="lazy" decoding="async" src="' + escapeHtml(imageUrl) + '" alt="' + escapeHtml(item.alt_text || item.title || "Kwikshift Movers gallery image") + '">',
                            '</a>',
                        '</div>',
                        '<div class="project-content">',
                            '<a href="' + escapeHtml(link) + '" class="category">' + escapeHtml(item.category) + '</a>',
                            '<h3><a href="' + escapeHtml(link) + '">' + escapeHtml(item.title) + '</a></h3>',
                        '</div>',
                    '</div>',
                '</div>'
            ].join("");
        }).join("");
    }

    function renderCareerGrid(items) {
        return items.map(function (item, index) {
            var detailItems = [
                renderCareerDetail("Location", item.location),
                renderCareerDetail("Employment Type", item.employment_type)
            ];
            var requirementsText = renderRequirements(item.requirements);
            var requirementsMarkup = requirementsText ? [
                '<div class="career-card__requirements">',
                    "<h4>Role Requirements</h4>",
                    '<ul class="check-list mb-0">' + requirementsText + "</ul>",
                "</div>"
            ].join("") : "";
            var applyLink = "career-application?job_id=" + encodeURIComponent(item.id);

            if (item.salary_range) {
                detailItems.push(renderCareerDetail("Salary", item.salary_range));
            }

            if (item.deadline) {
                detailItems.push(renderCareerDetail("Deadline", formatDate(item.deadline)));
            }

            return [
                '<div class="career-card-col">',
                    '<article class="career-card team-content mt-0 me-0 wow fade-in-bottom" data-wow-delay="' + escapeHtml(getDelay(index, 100)) + 'ms">',
                        '<h4 class="position">' + escapeHtml(item.department) + " / " + escapeHtml(item.employment_type) + "</h4>",
                        "<h3>" + escapeHtml(item.job_title) + "</h3>",
                        '<div class="career-card__details">' + detailItems.join("") + "</div>",
                        '<div class="career-card__summary">' + formatParagraphs(item.job_description) + "</div>",
                        requirementsMarkup,
                        '<div class="career-card__actions">',
                            '<a href="' + escapeHtml(applyLink) + '" class="default-btn">Apply Now</a>',
                        "</div>",
                    "</article>",
                "</div>"
            ].join("");
        }).join("");
    }

    function renderServiceCards(items) {
        return items.map(function (item, index) {
            var pageUrl = item.page_url || "#ajax_quote_form";
            var imageUrl = resolveImageUrl(item);
            var icon = item.icon || "fa-solid fa-truck-fast";

            return [
                '<div class="col-lg-3 col-md-6">',
                    '<div class="service-card wow fade-in-bottom" data-wow-delay="' + escapeHtml(getDelay(index, 100)) + 'ms">',
                        '<div class="service-thumb">',
                            '<img src="' + escapeHtml(imageUrl) + '" alt="' + escapeHtml(item.name) + '" width="960" height="1280" loading="lazy" decoding="async">',
                        '</div>',
                        '<div class="service-content">',
                            '<i class="' + escapeHtml(icon) + '"></i>',
                            '<h3><a href="' + escapeHtml(pageUrl) + '">' + escapeHtml(item.name) + '</a></h3>',
                            '<p>' + escapeHtml(item.description) + '</p>',
                        '</div>',
                    '</div>',
                '</div>'
            ].join("");
        }).join("");
    }

    function renderCareerEmptyState(title, message) {
        var listingsGrid = $("#careers-listings-grid");
        var emptyTitle = title || "No Open Roles Right Now";
        var emptyMessage = message || "We do not have any active openings at the moment. Please check back later or contact us if you would like to share your CV for future consideration.";

        $("#careers-heading-title").html('No Open Roles <br><span class="hl">Right Now</span>');
        $("#careers-heading-copy").html("We will publish new opportunities here as soon as they become available.");
        listingsGrid.addClass("justify-content-center").html(
            '<div class="career-card-col career-card-col--empty">' +
                '<div class="team-content text-center mt-0 me-0">' +
                    '<div class="mb-4"><i class="fa-regular fa-circle-xmark" style="font-size: 64px; color: var(--primary-color);"></i></div>' +
                    "<h3 class=\"mb-3\">" + escapeHtml(emptyTitle) + "</h3>" +
                    "<p class=\"mb-4\">" + escapeHtml(emptyMessage) + "</p>" +
                    '<a href="contact" class="default-btn">Contact Our Team</a>' +
                "</div>" +
            "</div>"
        );
    }

    function renderRequirements(value) {
        var items = splitRequirements(value);

        if (!items.length) {
            return "";
        }

        return items.map(function (item) {
            return '<li><i class="fa-solid fa-check"></i>' + escapeHtml(item) + "</li>";
        }).join("");
    }

    function splitRequirements(value) {
        var items = String(value || "").split(/\r?\n|;/).map(function (item) {
            return item.trim();
        }).filter(function (item) {
            return item !== "";
        });

        return items;
    }

    function renderCareerDetail(label, value) {
        return '<p class="career-card__detail"><strong>' + escapeHtml(label) + ":</strong> " + escapeHtml(value) + "</p>";
    }

    function renderGridEmptyState(title, message) {
        return [
            '<div class="col-12">',
                '<div class="team-content text-center mt-0 me-0">',
                    "<h3>" + escapeHtml(title) + "</h3>",
                    "<p>" + escapeHtml(message) + "</p>",
                "</div>",
            "</div>"
        ].join("");
    }

    function renderGalleryFallbackGrid() {
        return renderGalleryGrid((getLocalFallback("gallery", {}) || {}).data || [], false);
    }

    function renderTestimonialsFallbackGrid() {
        return [
            '<div class="col-12">',
                '<div class="team-content text-center mt-0 me-0">',
                    '<h3>Customer reviews are temporarily unavailable.</h3>',
                    '<p>Please check back shortly, or contact Kwikshift Movers directly for references and moving advice.</p>',
                    '<a class="default-btn" href="contact">Contact Our Team</a>',
                '</div>',
            '</div>'
        ].join("");
    }

    function renderAccordionEmptyState(title, message) {
        return [
            '<div class="team-content text-center mt-0 me-0">',
                "<h3>" + escapeHtml(title) + "</h3>",
                "<p>" + escapeHtml(message) + "</p>",
            "</div>"
        ].join("");
    }

    function renderCarouselEmptySlide(title, message) {
        return [
            '<div class="swiper-slide">',
                '<div class="team-content text-center mt-0 me-0">',
                    "<h3>" + escapeHtml(title) + "</h3>",
                    "<p>" + escapeHtml(message) + "</p>",
                "</div>",
            "</div>"
        ].join("");
    }

    function formatParagraphs(value) {
        return escapeHtml(String(value || "")).replace(/\r?\n/g, "<br>");
    }

    function getGalleryCategoryLink(category, useGalleryFallback) {
        var value = String(category || "").toLowerCase();

        if (value.indexOf("office") !== -1) {
            return "corporate-office-relocation.html";
        }

        if (value.indexOf("packing") !== -1 || value.indexOf("storage") !== -1) {
            return "storage-packing-solutions.html";
        }

        if (value.indexOf("long-distance") !== -1 || value.indexOf("transport") !== -1 || value.indexOf("intercity") !== -1) {
            return "long-distance-intercity-moves.html";
        }

        if (value.indexOf("residential") !== -1 || value.indexOf("home") !== -1) {
            return useGalleryFallback ? "gallery.html" : "residential-relocations.html";
        }

        return "gallery.html";
    }

    function getStringFilter(name) {
        return String(queryParams.get(name) || "").trim();
    }

    function getBooleanFilter(name) {
        var value = String(queryParams.get(name) || "").trim().toLowerCase();

        if (!value) {
            return null;
        }

        if (value === "1" || value === "true" || value === "yes") {
            return true;
        }

        if (value === "0" || value === "false" || value === "no") {
            return false;
        }

        return null;
    }

    function refreshProjectUi() {
        callUi("initProjectCarousel");
        callUi("initVenoBox");
        callUi("initWow");
        callUi("initGalleryImages");
    }

    function refreshTestimonialUi() {
        callUi("initTestimonialCarousel");
        callUi("initWow");
    }

    function callUi(methodName) {
        if (window.KwikshiftUi && typeof window.KwikshiftUi[methodName] === "function") {
            window.KwikshiftUi[methodName]();
        }
    }

    function hasItems(response) {
        return !!(response && (response.ok === true || response.success === true) && Array.isArray(response.data) && response.data.length);
    }

    function getDelay(index, baseDelay) {
        return baseDelay + (index * 200);
    }

    function normalizeRating(value) {
        var rating = parseFloat(value);

        if (window.isNaN(rating) || rating < 0) {
            rating = 0;
        }

        if (rating > 5) {
            rating = 5;
        }

        return Math.round(rating * 2) / 2;
    }

    function renderStars(value) {
        var rating = normalizeRating(value);
        var stars = "";
        var index;

        for (index = 1; index <= 5; index += 1) {
            if (rating >= index) {
                stars += '<li><i class="fa-solid fa-star"></i></li>';
                continue;
            }

            if (rating >= index - 0.5) {
                stars += '<li><i class="fa-solid fa-star-half-stroke"></i></li>';
                continue;
            }

            stars += '<li><i class="fa-regular fa-star"></i></li>';
        }

        return stars;
    }

    function formatRating(value) {
        var rating = normalizeRating(value);

        if (Math.floor(rating) === rating) {
            return rating.toFixed(0);
        }

        return rating.toFixed(1);
    }

    function formatDate(value) {
        var formatted = new Date(String(value) + "T00:00:00");

        if (window.isNaN(formatted.getTime())) {
            return String(value || "");
        }

        return formatted.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    }

    function injectJsonLd(id, payload) {
        var existing = document.getElementById(id);
        var script = document.createElement("script");

        if (existing && existing.parentNode) {
            existing.parentNode.removeChild(existing);
        }

        script.id = id;
        script.type = "application/ld+json";
        script.text = JSON.stringify(payload);
        document.head.appendChild(script);
    }

    function injectFaqJsonLd(items) {
        if (!$("#faq-accordion").length || !Array.isArray(items) || !items.length) {
            return;
        }

        injectJsonLd("dynamic-faq-jsonld", {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": items.map(function (item) {
                return {
                    "@type": "Question",
                    "name": item.question,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": item.answer
                    }
                };
            })
        });
    }

    function injectJobPostingJsonLd(items) {
        var siteUrl = (typeof AppConfig !== "undefined" && AppConfig.siteUrl) ? AppConfig.siteUrl : "https://www.kwikshiftmovers.co.ke";

        if (!$("#careers-listings-grid").length || !Array.isArray(items) || !items.length) {
            return;
        }

        injectJsonLd("dynamic-jobposting-jsonld", {
            "@context": "https://schema.org",
            "@graph": items.map(function (item) {
                return {
                    "@type": "JobPosting",
                    "title": item.job_title || item.title,
                    "description": item.job_description || item.description || item.summary || "",
                    "datePosted": item.posted_at || undefined,
                    "validThrough": item.closes_at || undefined,
                    "employmentType": item.employment_type || undefined,
                    "hiringOrganization": {
                        "@type": "Organization",
                        "name": "Kwikshift Movers",
                        "sameAs": siteUrl,
                        "logo": siteUrl + "/assets/img/logo.png"
                    },
                    "jobLocation": {
                        "@type": "Place",
                        "address": {
                            "@type": "PostalAddress",
                            "addressLocality": item.location || "Nairobi",
                            "addressCountry": "KE"
                        }
                    },
                    "url": siteUrl + "/career-application?job_id=" + encodeURIComponent(item.id)
                };
            })
        });
    }

    function escapeHtml(value) {
        return String(value == null ? "" : value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function initGalleryImages() {
        // Initialize image load handlers for skeleton loaders
        $(".gallery-image").each(function () {
            var $img = $(this);
            var imageId = $img.attr("id");
            var $loader = $("#loader-" + imageId);

            if (!imageId || !$loader.length) {
                return; // Skip if no loader found
            }

            // Check if image is already loaded (cached)
            if (this.complete && this.naturalHeight !== 0) {
                $img.addClass("loaded");
                $loader.addClass("loaded");
                return;
            }

            // Add load event listener
            $img.on("load", function () {
                $img.addClass("loaded");
                $loader.addClass("loaded");
            });

            // Handle error - hide skeleton after timeout or error
            $img.on("error", function () {
                $loader.addClass("loaded");
                $img.css("opacity", "1");
            });

            // Timeout fallback - hide skeleton after 10 seconds
            setTimeout(function () {
                if (!$loader.hasClass("loaded")) {
                    $loader.addClass("loaded");
                    $img.css("opacity", "1");
                }
            }, 10000);
        });
    }
})(jQuery);
