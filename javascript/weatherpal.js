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
			info: "Min: -6&deg;C<br />Max: 2&deg;C"
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
		$("#settings_alert").hide();
	});
	
	$("#save_settings").on("click", function() {
		save_settings();
	});
	
	$("#planner_search").submit(function() {
		var search_string = $("#planner_search > input[name=search_field]").val();
		if(search_string.length == 0) {
			$("#result_box").hide();
			return false;
		}

		if("malta".indexOf(search_string.toLowerCase()) > -1) {
			$("#result_box").show();
		} else {
			$("#result_box").hide();
		}
		
		return false;
	});
	
	$("#result_box > button").on("click", function() {
		var place_alert = {
			name: "Malta",
			temperature: 23,
			info: "Min: 12&deg;C<br />Max: 28&deg;C"
		};
		
		add_alert_element(place_alert, true);

		var alerts = JSON.parse(localStorage[PREFIX + "place_alerts"]);
		alerts.push(place_alert);
		localStorage[PREFIX + "place_alerts"] = JSON.stringify(alerts);
	});
	
	$("#friend_search").submit(function() {
		var search_string = $("#friend_search > input[type=text]").val();
		if("anne holt".indexOf(search_string.toLowerCase()) > -1) {
			$("#search_results").show();
		} else {
			$("#search_results").hide();
		}

		return false;
	});
	
	$("#search_results button").on("click", function() {
		$(this).hide();
	});
	
	load_settings();
});

function remove_alert(index) {
	place_alerts = JSON.parse(localStorage[PREFIX + "place_alerts"]);
	place_alerts.pop(index);
	localStorage[PREFIX + "place_alerts"] = JSON.stringify(place_alerts);
}

function save_settings() {
	$("#settings_alert").show();
	$("#pr_box > input[type=text]").each(function(index, elm) {
		localStorage[PREFIX + $(elm).attr("name")] = $(elm).val();
	});
	
	$("#share_settings > input[type=checkbox]").each(function(index, elm) {
		elm = $(elm);
		localStorage[PREFIX + elm.attr("name")] = elm.prop('checked');
	});

	localStorage[PREFIX + "watch_show"] = $("select[name=watch_show]").val();
	localStorage[PREFIX + "watch_time"] = $("select[name=watch_time]").val();
}

function load_settings() {
	$("#pr_box > input[type=text]").each(function(index, elm) {
		$(elm).val(localStorage[PREFIX + $(elm).attr("name")]);
	});
	
	$("#share_settings > input[type=checkbox]").each(function(index, elm) {
		elm = $(elm);
		elm.prop('checked', localStorage[PREFIX + elm.attr("name")] == 'true');
	});
	
	$("select[name=watch_show]").val(localStorage[PREFIX + "watch_show"]);
	$("select[name=watch_time]").val(localStorage[PREFIX + "watch_time"]);
}
