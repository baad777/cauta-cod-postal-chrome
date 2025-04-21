$(document).ready(function () {
    let query = new URLSearchParams(window.location.search).get("query") || "";
    let results = [];
    let filters = {};
    let sortColumn = "";
    let sortAsc = true;
    let queryInput = $("#query-input");

    $("#query").text(query);
    queryInput.val(query);
    $("#loading").show();

    function fetchResults() {
        $.getJSON(`https://oapi.ro/coduri-postale?q=${encodeURIComponent(query)}`)
            .done(data => {
                results = data;
                renderTable();
            })
            .fail(() => {
                results = [];
                renderTable();
            })
            .always(() => {
                $("#loading").hide();
            });
    }

    function renderTable() {
        let filteredResults = results.filter(result => {
            return Object.keys(filters).every(key =>
                result[key]?.toLowerCase().includes(filters[key].toLowerCase())
            );
        });

        if (sortColumn) {
            filteredResults.sort((a, b) => {
                if (a[sortColumn] < b[sortColumn]) return sortAsc ? -1 : 1;
                if (a[sortColumn] > b[sortColumn]) return sortAsc ? 1 : -1;
                return 0;
            });
        }

        const rows = filteredResults.map(result => `
            <tr>
                <td>${result.county || ""}</td>
                <td>${result.city || ""}</td>
                <td>${result.street_type || ""}</td>
                <td>${result.street_name || ""}</td>
                <td>${result.street_number || ""}</td>
                <td>${result.postcode || ""}</td>
            </tr>
        `).join("");

        $("#results").html(rows);
    }

    $("th").on("click", function () {
        const column = $(this).data("column");
        if (sortColumn === column) {
            sortAsc = !sortAsc;
        } else {
            sortColumn = column;
            sortAsc = true;
        }
        renderTable();
    });

    $(".filter-input").on("input", function () {
        const filterKey = $(this).data("filter");
        filters[filterKey] = $(this).val();
        renderTable();
    });

    queryInput.on("keypress", function (e) {
        if (e.key === "Enter") {
            $("#search-button").click();
        }
    });

    $("#search-button").on("click", function () {
        query = $("#query-input").val().trim();
        if (query) {
            $("#loading").show();
            fetchResults();
        }
    });

    fetchResults();
});