var PREFIX = "se.weatherpal.";

function add_alert_element(place_alert, animated) {
	var copy = $(".place_alert.placeholder").clone(true);
	copy.find("p > .placename").text(place_alert.name);
	copy.find("p > .temperature").html(place_alert.temperature + "&deg;C");
	copy.find(".info").html(place_alert.info);
	copy.removeClass("placeholder");
	$("#alerts").append(copy);
	if(animated) {
		copy.hide();
		copy.slideDown("fast");
	}
}

function select_tab(index) {
	// Select the tab
	var selected_tab = $(".tab").eq(index);
	$(".tab").not(selected_tab).removeClass("active");
	selected_tab.addClass("active");
	
	// Display the right content
	var selected_content = $("#main > div[id^=main]").eq(index);
	$("#main > div").not(selected_content).removeClass("active");
	selected_content.addClass("active");
}

$(document).ready(function() {
	select_tab(0);

	if(localStorage[PREFIX + "place_alerts"] == undefined) {
		localStorage[PREFIX + "place_alerts"] = JSON.stringify([{
			name: "Linköping",
			temperature: -1,
			info: "Hej"
		}]);
	}
	
	place_alerts = JSON.parse(localStorage[PREFIX + "place_alerts"]);
	for(var i in place_alerts) {
		var place_a = place_alerts[i];
		add_alert_element(place_a, false);
	}

    $(".place_alert .close").on("click", function() {
		var container = $(this).parent();
		container.slideUp("fast", function() {
			$(this).remove();
			remove_alert($(".place_alert").index(container));
		});
	});
	
	$(".fold").on("click", function() {
		var container = $(this).parent();
		var new_height = 120;
		if(container.height() == new_height) {
			new_height = 50;
		}
		container.animate({"height": new_height}, "fast");
	});
	
	$(".tab").on("click", function() {
		var index = $(".tab").index($(this));
		select_tab(index);
	});
});

function remove_alert(index) {
	place_alerts = JSON.parse(localStorage[PREFIX + "place_alerts"]);
	place_alerts.pop(index);
	localStorage[PREFIX + "place_alerts"] = JSON.stringify(place_alerts);
}
