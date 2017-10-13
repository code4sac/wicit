var wicItApp = angular.module("wicItApp", ["wicItApp.Constants", "ui.router", "ngAnimate", "leaflet-directive", "geolocation", "notifications"]),
    mapState = {name: "map", url: "/map", templateUrl: "partials/map.html"}, qualifyState = {
        name: "qualify",
        abstract: !0,
        url: "/qualify",
        templateUrl: "partials/qualify",
        controller: "QualifyCtrl"
    }, qualifyResidencyState = {
        name: "qualify.residency",
        url: "",
        parent: qualifyState,
        templateUrl: "partials/qualify-residency"
    }, qualifyCategoryState = {
        name: "qualify.category",
        parent: qualifyState,
        abstract: !0,
        url: "/category",
        templateUrl: "partials/qualify-category"
    }, qualifyCategoryPregnantState = {
        name: "qualify.category.pregnant",
        parent: qualifyCategoryState,
        url: "",
        templateUrl: "partials/qualify-category-pregnant"
    }, qualifyCategoryBreastfeedingState = {
        name: "qualify.category.breastfeeding",
        parent: qualifyCategoryState,
        url: "/category/breastfeeding",
        templateUrl: "partials/qualify-category-breastfeeding"
    }, qualifyCategoryInfantState = {
        name: "qualify.category.infant",
        parent: qualifyCategoryState,
        url: "/category/infant",
        templateUrl: "partials/qualify-category-infant"
    }, qualifyCategoryChildState = {
        name: "qualify.category.child",
        parent: qualifyCategoryState,
        url: "/category/child",
        templateUrl: "partials/qualify-category-child"
    }, qualifyCategoryOtherProgramsState = {
        name: "qualify.category.otherprograms",
        parent: qualifyCategoryState,
        url: "/category/other-programs",
        templateUrl: "partials/qualify-category-otherprograms"
    }, qualifyIncomeState = {
        name: "qualify.income",
        parent: qualifyState,
        url: "/income",
        templateUrl: "partials/qualify-income"
    }, qualifyResultState = {
        name: "qualify.result",
        parent: qualifyState,
        url: "/result",
        templateUrl: "partials/qualify-result"
    }, aboutState = {name: "about", url: "/about", templateUrl: "partials/about"}, searchState = {
        name: "search",
        url: "/search",
        templateUrl: "partials/search",
        controller: "SearchCtrl"
    };
wicItApp.config(["$stateProvider", "$urlRouterProvider", function (a, b) {
    b.otherwise("/map"), a.state(mapState).state(qualifyState).state(qualifyResidencyState).state(qualifyCategoryState).state(qualifyCategoryPregnantState).state(qualifyCategoryBreastfeedingState).state(qualifyCategoryInfantState).state(qualifyCategoryChildState).state(qualifyCategoryOtherProgramsState).state(qualifyIncomeState).state(qualifyResultState).state(aboutState).state(searchState)
}]), wicItApp.controller("AboutCtrl", ["$scope", "$http", function (a, b) {
}]), wicItApp.controller("AppCtrl", ["$scope", "$state", "NotificationService", function (a, b, c) {
    a.$state = b
}]), wicItApp.controller("MapCtrl", ["$scope", "$http", "leafletEvents", "leafletData", "leafletHelpers", "leafletMarkersHelpers", "NotificationService", "GeolocationService", "Constants", function (a, b, c, d, e, f, g, h, i) {
    function j() {
        angular.extend(a, {
            defaults: {
                tileLayer: z,
                maxZoom: s,
                minZoom: t,
                zoomControlPosition: "bottomright",
                tileLayerOptions: {detectRetina: !0, reuseTiles: !0}
            },
            center: {lat: 38.5556, lng: -121.4689, zoom: r},
            markers: {user: {lat: 38.5556, lng: -121.4689, focus: !0, icon: u}}
        })
    }

    function k() {
        var b = L.Control.extend({
            options: {position: "bottomright"}, onAdd: function (a) {
                var b = L.DomUtil.create("div", "locate-control");
                L.DomEvent.addListener(b, "click", function () {
                    l({forceUpdate: !0})
                });
                L.DomUtil.create("div", "leaflet-control-command-interior", b);
                return b
            }
        });
        a.controls = {custom: [new b]}
    }

    function l(a) {
        h.getPosition(a).then(m, n)
    }

    function m(b) {
        a.mapLoading = !1;
        var c = b.coords.latitude, d = b.coords.longitude;
        a.center = {lat: c, lng: d, zoom: r}, a.markers.user.lat = c, a.markers.user.lng = d
    }

    function n(b) {
        var c = b.code == b.PERMISSION_DENIED ? "Dang, geolocation is disabled." : "Dang, we can't get your location.";
        g.addNotificiation({message: c, status: g.STATUSES.ERROR}), a.mapLoading = !1
    }

    function o(c) {
        function d(b) {
            var  nLocations = 0;
            b.result.records.forEach(function (b) {
               var loc = b.Location;
               var regexLatLng = /\((-?[0-9]+\.?[0-9]*) *, *(-?[0-9]+\.?[0-9]*)\)/g;
               var [orig, latitude, longitude] = regexLatLng.exec(loc);
               var c = parseFloat(latitude), d = parseFloat(longitude),
                    e = b.Vendor, f = b.City, g = b["Zip Code"], h = b.Address;
               if (c >  0) {
                  b["Second Address"] && b["Second Address"].indexOf('"') < 0 && (h += " " + b["Second Address"]), h += ", " + f + " " + g;
                  var i = "<h3>" + e + '</h3><p class="address">' + h + '</p><p class="directions"><a href="https://maps.google.com?saddr=Current+Location&daddr=' + h + '" target="_blank">Directions</a></p>';
                  a.markers[p(e)] = {
                      group: b.County,
                      groupOption: {showCoverageOnHover: !1},
                      lat: c,
                      lng: d,
                      focus: !1,
                      message: i,
                      icon: v
                  }
                  nLocations++;
               } else {
                 console.warn("Location is no good", b);
               }
            })
            console.log("Parsed locations: " + nLocations);
        }

        function e(a, b, c, d) {
            g.addNotificiation({
                message: "Unable to load nearby locations.",
                status: g.STATUSES.ERROR
            })
        }

        mapUpdating = !0;
        var f = C.getNorthWest(), h = C.getSouthEast(), i = A;
        return i += "&q=SACRAMENTO", b.get(i).success(d).error(e)
        //return i += "&bbox=" + f.lat + "," +  f.lng + "," + h.lat + "," + h.lng , b.get(i).success(d).error(e)
        //return i += "?$where=within_box(location," + f.lat + "," + f.lng + "," + h.lat + "," + h.lng + ")", i += "&$$app_token=" + y, b.get(i).success(d).error(e)
    }

    function p(a) {
        return a.replace(/\W/g, "")
    }

    function q(a, b, c, d, e, f) {
        return {
            iconUrl: a,
            iconRetinaUrl: b,
            shadowUrl: c,
            shadowRetinaUrl: d,
            iconSize: [e, f],
            shadowSize: [e, f],
            iconAnchor: [0, f / 2],
            shadowAnchor: [0, f / 2],
            popupAnchor: [f / 2, -10]
        }
    }

    var r = 13, s = 18, t = 10,
        u = q("images/pin.png", "images/pin@2x.png", "images/pin_shadow.png", "images/pin_shadow@2x.png", 30, 30),
        v = q("images/marker.png", "images/marker@2x.png", "images/marker_shadow.png", "images/marker_shadow@2x.png", 30, 30),
        w = i.mapboxId, x = i.mapboxToken, y = i.apiToken,
        z = "https://api.mapbox.com/styles/v1/" + w + "/tiles/256/{z}/{x}/{y}?access_token=" + x,
        A = "https://data.chhs.ca.gov/api/action/datastore_search?resource_id=ee10b67b-2b93-47e7-aa41-cecfbbd32e17", B = !1, C = !1;
    a.mapLoading = !0, j(), k(), l(), a.$on("leafletDirectiveMap.moveend", function (b) {
        d.getMap().then(function (c) {
            C && (B = C), C = c.getBounds(), B && B.contains(C) || o(b).then(function () {
                mapUpdating = !1, a.mapLoading = !1
            })
        })
    }), a.$on("$destroy", function () {
        f.resetMarkerGroups()
    })
}]), wicItApp.controller("QualifyCtrl", ["$scope", "$state", "NotificationService", function (a, b, c) {
    a.family = {}, a.periods = [{label: "year", value: 1}, {
        label: "month",
        value: 12
    }, {label: "week", value: 52}], a.submit = function () {
        var b = !1;
        if (a.family.income && parseFloat(a.family.income) || (c.addNotificiation({
                message: "Please enter your income.",
                status: c.STATUSES.ERROR
            }), b = !0), a.family.count && parseInt(a.family.count) || (c.addNotificiation({
                message: "Please enter the number of people in your family.",
                status: c.STATUSES.ERROR
            }), b = !0), b)return !1;
        var d = a.family.income * a.family.payperiod, e = 21590 + 7511 * a.family.count;
        d > e ? a.result(!1, "income") : a.result(!0)
    }, a.result = function (c, d) {
        a.success = c, a.reason = !!d && d, b.transitionTo("qualify.result", {
            success: c,
            reason: d
        })
    }, a.next = function (a, c) {
        b.transitionTo(a)
    }
}]), wicItApp.controller("SearchCtrl", ["$scope", function (a) {
    var b = "initial", c = "pending", d = "results", e = "noResults", f = "error", g = 25, h = 200;
    a.state = b, a.results = [], a.count = 0, a.query = "";
    var i = 0;
    a.submit = function () {
        if (!a.query)return a.state = b, void clearTimeout(i);
        a.results.length || (a.state = c);
        var j = function () {
            $.ajax("/approved-foods", {data: {q: a.query}, dataType: "json"}).done(function (b) {
                a.$apply(function () {
                    a.count = b.count, a.state = b.count ? d : e, a.results = b.results.slice(0, g)
                })
            }).fail(function () {
                a.$apply(function () {
                    a.state = f
                })
            })
        };
        clearTimeout(i), i = setTimeout(j, h)
    }
}]);
var geolocation = angular.module("geolocation", []);
geolocation.factory("GeolocationService", ["$q", function (a) {
    var b = 864e5, c = {};
    if (c.position = !1, window.localStorage) {
        try {
            c.position = JSON.parse(localStorage.getItem("position"))
        } catch (a) {
            c.position = !1
        }
        var d = c.position ? c.position.timestamp : 0;
        Date.now() - d > b && (c.position = !1)
    }
    return c.getPosition = function (b) {
        function c(a) {
            if (f.position = a, g.resolve(f.position), window.localStorage)try {
                localStorage.setItem("position", e(a))
            } catch (a) {
            }
        }

        function d(a) {
            g.reject(a)
        }

        function e(a) {
            return JSON.stringify({
                timestamp: Date.now(),
                coords: {
                    accuracy: a.coords.accuracy,
                    latitude: a.coords.latitude,
                    longitude: a.coords.longitude
                }
            })
        }

        b = b || {};
        var f = this, g = a.defer();
        return this.position && !b.forceUpdate ? g.resolve(this.position) : navigator.geolocation ? navigator.geolocation.getCurrentPosition(c, d) : g.reject("Geolocation error."), g.promise
    }, c
}]);
var notificationsModule = angular.module("notifications", []);
notificationsModule.factory("NotificationService", ["$rootScope", "$timeout", function (a, b) {
    var c = {}, d = {};
    return c.STATUSES = {
        INFO: {class: "info", duration: 5e3},
        IMPORTANT: {class: "important", duration: 1e4},
        SUCCESS: {class: "success", duration: 3e3},
        WARNING: {class: "warning", duration: 5e3},
        ERROR: {class: "error", duration: 1e4}
    }, c.addNotificiation = function (c) {
        var e = Object.keys(d).length;
        d[e] = c, a.notifications = d, a.$broadcast("newNotification"), b(function () {
            delete d[e], a.notifications = d
        }, c.status.duration)
    }, c
}]);
