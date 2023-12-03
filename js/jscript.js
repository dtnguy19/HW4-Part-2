/*
File: jscript.js
GUI Assignment: Updating our HW3 so that it can utilize the JQuery Validation Plugin
Danny Nguyen, UMass Lowell Computer Science, Danny_nguyen2@student.uml.edu
Copyright (c) 2023 by Danny. All rights reserved. May be freely copied or 
excerpted for educational purposes with credit to the author. 
updated by DN on November 28, 2023 at 4:50 pm.
*/
	
// Counter for tabs
var tabCounter = 1;

// Function to add a new tab
function addTab(tableName, tableHTML) {
    // Create a unique ID for the tab and its associated content
    var tabId = "tab-" + tabCounter;
    var contentId = "content-" + tabCounter;

    // Check if the tab already exists
    if ($("#tabs ul a[href='#" + contentId + "']").length == 0) {
        // Append a new tab and content to the tabs container with a checkbox
        $("#tabs ul").append("<li><input type='checkbox' class='tab-checkbox' data-content-id='" + contentId + "' />" +
            "<a href='#" + contentId + "'>" + tableName + "</a><span class='ui-icon ui-icon-close' role='presentation'>Remove Tab</span></li>");
        $("#tabs").append("<div id='" + contentId + "'>" + tableHTML + "</div>");

        // Increment the tab counter
        tabCounter++;

        // Refresh the tabs widget
        $("#tabs").tabs("refresh");
    }

    // Activate the new tab
    $("#tabs").tabs("option", "active", -1);
}

// Close button click handler
$("#tabs ul").on("click", "span.ui-icon-close", function() {
    var tabId = $(this).closest("li").remove().attr("aria-controls");
    $("#" + tabId).remove();
    $("#tabs").tabs("refresh");
});

// Delete selected tabs button click handler
$("#deleteTabsBtn").on("click", function() {
    // Iterate over each checked checkbox and remove the corresponding tab
    $(".tab-checkbox:checked").each(function() {
        var contentId = $(this).data("content-id");
        $("#tabs ul a[href='#" + contentId + "']").closest("li").remove();
        $("#" + contentId).remove();
    });

    // Refresh the tabs widget
    $("#tabs").tabs("refresh");
});

// Custom rule to check to see if the min and max values are the same
$.validator.addMethod("notSame", function(value, element, param) {
  return value !== $(param).val();
}, "Values cannot be the same.");

// Custom rule to check to see if the minimum value is larger than the maximum value
$.validator.addMethod("minMax", function(value, element, param) {
    var minField = $("#" + param[0]);
    var maxField = $("#" + param[1]);

    console.log("minField value:", $("#"+ param[0] + "Slider").slider("value"));
    console.log("maxField value:", $("#"+ param[1] + "Slider").slider("value"));

    return $("#"+ param[0] + "Slider").slider("value") < $("#"+ param[1] + "Slider").slider("value");
}, "Min must be smaller than Max.");


$(document).ready(function() {
  $(function() {
    // Slider initialization for C1
    $("#C1Slider").slider({
        range: "min",
        value: 0,
        min: -50,
        max: 50,
        slide: function(event, ui) {
            $("#C1Input").val(ui.value);
        }
    });

    // Slider initialization for C2
    $("#C2Slider").slider({
        range: "min",
        value: 0,
        min: -50,
        max: 50,
        slide: function(event, ui) {
            $("#C2Input").val(ui.value);
        }
    });

    // Slider initialization for R1
    $("#R1Slider").slider({
        range: "min",
        value: 0,
        min: -50,
        max: 50,
        slide: function(event, ui) {
            $("#R1Input").val(ui.value);
        }
    });

    // Slider initialization for R2
    $("#R2Slider").slider({
        range: "min",
        value: 0,
        min: -50,
        max: 50,
        slide: function(event, ui) {
            $("#R2Input").val(ui.value);
        }
    });
});

  $("#multiplicationForm").validate({
    rules: {
      C1: {
        min: -50,
        max: 50,
        notSame: "#C2", //C1 is not the same as C2
        minMax: ["C1", "C2"] //C1 is less than C2
      },
      C2: {
        min: -50,
        max: 50,
        notSame: "#C1", //C2 is not the same as C1
        minMax: ["C1", "C2"] //C1 is less than C2
      },
      R1: {
        min: -50,
        max: 50,
        notSame: "#R2", //R1 is not the same to R2
        minMax: ["R1", "R2"] //R1 is less than R2
      },
      R2: {
        min: -50,
        max: 50,
        notSame: "#R1", //R2 is not the same as R1
        minMax: ["R1", "R2"] //R1 is less than R2
	  }
    },
    messages: {
      C1: {
        min: "Column value must be greater than or equal to -50.",
        max: "Column value must be less than or equal to 50.",
        notSame: "Min and Max column values cannot be the same.",
        minMax: "Min must be smaller than Max."
      },
      C2: {
        min: "Column value must be greater than or equal to -50.",
        max: "Column value must be less than or equal to 50.",
        notSame: "Min and Max column values cannot be the same.",
        minMax: "Min must be smaller than Max."
      },
      R1: {
        min: "Row value must be greater than or equal to -50.",
        max: "Row value must be less than or equal to 50.",
        notSame: "Min and Max row values cannot be the same.",
        minMax: "Min must be smaller than Max."
      },
      R2: {
        min: "Row value must be greater than or equal to -50.",
        max: "Row value must be less than or equal to 50.",
        notSame: "Min and Max row values cannot be the same.",
        minMax: "Min must be smaller than Max."
      }
    },
    submitHandler: function(form) {
      generateTable();
    }
  });
});
function generateTable() {
  console.log("Generate Table function called."); // Check if the function is called
  // Check if the form is valid
  $("#tabs").tabs();
  if ($("#multiplicationForm").valid()) {
    // Retrieve input values
	const C1Input = $("#C1Input").val();
	const C2Input = $("#C2Input").val();
	const R1Input = $("#R1Input").val();
	const R2Input = $("#R2Input").val();

	// Use the input value if available, otherwise use the slider value
	const C1 = C1Input ? parseInt(C1Input) : $("#C1Slider").slider("value");
	const C2 = C2Input ? parseInt(C2Input) : $("#C2Slider").slider("value");
	const R1 = R1Input ? parseInt(R1Input) : $("#R1Slider").slider("value");
	const R2 = R2Input ? parseInt(R2Input) : $("#R2Slider").slider("value");
    // Clear error message
    document.getElementById("errorMessage").innerText = "";

    // Generate multiplication table
    let tableHTML = "<table><thead><tr><th></th>";
    for (let i = C1; i <= C2; i++) {
      tableHTML += `<th>${i}</th>`;
    }
    tableHTML += "</tr></thead><tbody>";

    for (let i = R1; i <= R2; i++) {
      tableHTML += `<tr><th>${i}</th>`;
      for (let j = C1; j <= C2; j++) {
        tableHTML += `<td>${i * j}</td>`;
      }
      tableHTML += "</tr>";
    }

    tableHTML += "</tbody></table>";

    // Display table
    const tableName = "Multiplication Table: " + C1 + " to " + C2 + " x " + R1 + " to " + R2;
    //$("#tableName").text(tableName);
    //$("#tableContainer").html(tableHTML);
    //$("#tableContainer").css("backgroundImage", "url(imgs/background-img.jpg)"); // https://pixabay.com/photos/astronomy-bright-constellation-dark-1867616/ link for background image
    addTab(tableName, tableHTML);
  } else {
    // Display error message
    $("#errorMessage").text("Please fix the errors in the form.");
  }
}