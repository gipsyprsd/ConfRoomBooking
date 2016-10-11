define(['jquery',
    'backbone',
    'underscore',
    'collection/confcollection',
    'text!templates/Splash.html',
    'text!templates/Main.html',
    'text!templates/Details.html',
    'text!templates/Barcode.html',
    'text!templates/Booking.html',
    'text!templates/QuickBook.html',
    'text!templates/Settings.html',
    'text!templates/Map.html',
    'text!templates/Favourites.html'
], function($, Backbone, _, confCollection, splashTemplate, mainTemplate, detailTemplate, barcodeTemplate, bookingTemplate, bookedTemplate, settingsTemplate, mapTemplate, FavTemplate) {

    var AppView = Backbone.View.extend({
        el: $("#container"),
        statsTemplate: _.template(splashTemplate),
        events: {
            "click .homeLnk": "getHome",
            "click .icon1": "getAllRooms",
            "click .icon2": "getEachRoom",
            "click .icon3": "getBarCode",
            "click .icon6": "getSettings",
            "click .icon5": "getFavourites",
            "click .saveData": "saveLocalStorage",
            "click .bookCls": "bookRoom",
            "click .quickBook": "quickBook",
            "click .searchRoom": "searchRoom",
            "click .scanCode": "scanQRCode",
            "click .mapIcon": "showMap",
            "click .favIcon": "addFavourites",
            "keyup #filterInput": "searchName"

        },


        initialize: function() {
            //fetch data when backend is ready
            var that = this;
            _.bindAll(this, 'render');

            confCollection.bind('change', this.render);

            var userName = localStorage.getItem("UserName") || "Administrator";
            // update the request URL 
            var dformat = this.formatDate();

            this.render();

        },

        getHome: function() {
            this.statsTemplate = _.template(splashTemplate);
            this.render();

        },

        getAllRooms: function(arg) {
            var that = this;
            var dformat = this.formatDate();
            var userName = localStorage.getItem("UserName") || "Administrator";
            if (arg == "booked") {
                confCollection.url = "../www/all-response-booked.json";
            } else {
                confCollection.url = "../www/all-response.json";
            }
            this.statsTemplate = _.template(mainTemplate);
            confCollection.fetch({
                dataType: 'json',
                success: function() {
                    that.render();
                },
                error: function(er) {
                    that.render("Error");
                }
            });
        },

        getEachRoom: function() {
            this.statsTemplate = _.template(bookingTemplate);
            this.render();
        },

        quickBook: function(evt) {
            var room = $(evt.target).data('rooms'),
                eachItem = room.split(" ");
            var that = this,
                dformat = this.formatOnlyDate(),
                startTime = dformat + " " + eachItem[1] + ":00",
                endTime = dformat + " " + eachItem[2] + ":00";
            var userName = localStorage.getItem("UserName") || "Administrator";
            confCollection.url = "../www/all-response-booked.json";
            this.statsTemplate = _.template(bookedTemplate);

            confCollection.fetch({
                dataType: 'json',
                success: function() {
                    var statusArray = [{
                        "status": true
                    }];
                    if (statusArray[0].status) {
                        alert("Booking Successfull");
                    } else {
                        alert("Booking Unsuccessfull");
                    }
                    that.getAllRooms("booked");

                },
                error: function(er) {
                    that.render("Error");
                }
            });
        },

        getBarCode: function() {
            this.statsTemplate = _.template(barcodeTemplate);
            this.render();
        },
        getSettings: function() {
            this.statsTemplate = _.template(settingsTemplate);
            this.render();
        },

        bookRoom: function(evt) {
            var room = $(evt.target).data('rooms');
            var that = this,
                dformat = this.formatDate();
            var userName = localStorage.getItem("UserName") || "Administrator";
            confCollection.url = "../www/each-room.json";
            this.statsTemplate = _.template(detailTemplate);
            confCollection.fetch({
                dataType: 'json',
                success: function() {
                    that.render();
                },
                error: function(er) {
                    that.render("Error");
                }
            });
        },

        barCodechk: function() {
            this.statsTemplate = _.template(barcodeTemplate);
            this.render();
        },

        openBookRoom: function() {
            this.statsTemplate = _.template(bookingTemplate);
            this.render();
        },

        settingsPage: function() {
            this.statsTemplate = _.template(settingsTemplate);
            this.render();

        },
        saveLocalStorage: function() {
            var value1 = $("#userName").val(),
                value2 = $("#userPswd").val();
            localStorage.setItem("UserName", value1);
            localStorage.setItem("Password", value2);
            this.getAllRooms();
        },

        searchRoom: function() {
            var value1 = $("#startDate").val(),
                value2 = $("#endDate").val(),
                value3 = $("#startTime").val(),
                value4 = $("#endTime").val(),
                value5 = $("#capacity").val();
            var userName = localStorage.getItem("UserName") || "Administrator";
            var that = this;
            confCollection.url = "../www/each-room.json";
            this.statsTemplate = _.template(detailTemplate);
            confCollection.fetch({
                dataType: 'json',
                success: function() {
                    that.render();
                },
                error: function(er) {
                    that.render("Error");
                }
            });


        },
        scanQRCode: function() {
            var that = this;

            cordova.plugins.barcodeScanner.scan(
                function(result) {
                    // here
                    // alert(result.text);
                    var room = result.text.split("@");
                    var roomDetail = room[0];
                    var dformat = that.formatDate();
                    var userName = localStorage.getItem("UserName") || "Administrator";
                    //confCollection.url = "http://192.168.1.15:8080/meetingroom/roomdetails/" + userName + "/" + roomDetail + "/" + dformat;

                    confCollection.url = "../www/each-room.json";
                    that.statsTemplate = _.template(detailTemplate);
                    confCollection.fetch({
                        dataType: 'json',
                        success: function() {
                            that.render();
                        },
                        error: function(er) {
                            that.render("Error");
                        }
                    });

                },
                function(error) {
                    alert("Scanning failed: " + error);
                }
            );


        },
        showMap: function() {
            this.statsTemplate = _.template(mapTemplate);
            this.render();

        },

        render: function(arg) {

            this.$('#ContentDeck').html(this.statsTemplate({
                roomDetails: confCollection.toJSON()
            }));
        },

        redirectHome: function() {
            var that = this;
            var dformat = this.formatDate();
            var userName = localStorage.getItem("UserName") || "Administrator";
            confCollection.url = "http://192.168.1.15:8080/meetingroom/availability/all/test/" + userName + "/" + dformat;
            this.statsTemplate = _.template(statsTemplate);
            confCollection.fetch({
                dataType: 'jsonp',
                success: function() {
                    that.render();
                },
                error: function(er) {
                    that.render("Error");
                }
            });
        },


        getFavourites: function(event) {
            var that = this;

            confCollection.url = "../www/all-response.json";
            this.statsTemplate = _.template(FavTemplate);
            confCollection.fetch({
                dataType: 'json',
                success: function() {
                    that.pageRender();
                },
                error: function(er) {
                    that.render("Error");
                }
            });
        },
        addFavourites: function(evt) {
            var favRoom = $(evt.target.parentElement).data('rooms');
            var favouriteRoom = localStorage.getItem("favourites") || [];
            if (typeof favouriteRoom == "string") {
                favouriteRoom = JSON.parse(favouriteRoom);
            }
            favouriteRoom.push(favRoom);
            localStorage.setItem("favourites", JSON.stringify(favouriteRoom));


        },
        /*
		This Method is used to filter the favourites from localstorage of the device.
		*/
        pageRender: function() {
            /*Need a better way for filtering the favourites but am sick i can't think now*/
            var favName = localStorage.getItem("favourites") || [];
            var clonedCollection = confCollection.clone();
            var confColc = clonedCollection.models;
            for (var i = 0; i < confColc.length; i++) {
                if (favName.indexOf(confColc[i].get("name")) === -1) {
                    confCollection.remove(confColc[i]);
                }
            }
            this.render();
        },

        formatDate: function() {
            Number.prototype.padLeft = function(base, chr) {
                var len = (String(base || 10).length - String(this).length) + 1;
                return len > 0 ? new Array(len).join(chr || '0') + this : this;
            }
            var d = new Date(),
                dformat = [d.getFullYear(), (d.getMonth() + 1).padLeft(),
                    d.getDate().padLeft()
                ].join('-') + ' ' + [d.getHours().padLeft(),
                    d.getMinutes().padLeft(),
                    d.getSeconds().padLeft()
                ].join(':');
            return dformat;

        },
        formatOnlyDate: function() {

            Number.prototype.padLeft = function(base, chr) {
                var len = (String(base || 10).length - String(this).length) + 1;
                return len > 0 ? new Array(len).join(chr || '0') + this : this;
            }
            var d = new Date(),
                dformat = [d.getFullYear(), (d.getMonth() + 1).padLeft(),
                    d.getDate().padLeft()
                ].join('-');
            return dformat;
        },

        // Re-rendering the App just means refreshing the statistics -- the rest
        // of the app doesn't change.


        searchName: function(e) {
            var letters = $("#filterInput").val();
            var clonedCollection = confCollection.clone();
            this.statsTemplate = _.template(mainTemplate);
            if (letters !== "") {
                var filterd = confCollection.search(letters);
                clonedCollection.models = filterd;
            }
            this.$('#ContentDeck').html(this.statsTemplate({
                roomDetails: clonedCollection.toJSON()
            }));
            $("#filterInput").val(letters);
            $("#filterInput").focus();
        }

    });
    return AppView;
});