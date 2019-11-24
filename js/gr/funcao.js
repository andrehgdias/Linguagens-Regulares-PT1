(function($) {
  RemoveTableRow = function(handler) {
    var tr = $(handler).closest("tr");

    tr.fadeOut(400, function() {
      tr.remove();
    });

    return false;
  };

  AddTableRow = function() {
    var newRow = $("<tr>");
    var cols = "";
    cols += '<td><input type="text" name="lhs"></td>';

    cols += '<td><input type="text" name="rhs"></td>';
    cols += '<td class="actions">';
    cols +=
      '<button class="waves-effect waves-light red darken-1 btn-small" onclick="RemoveTableRow(this)" type="button">Remover</button>';
    cols += "</td>";

    newRow.append(cols);

    $("#products-table").append(newRow);

    return false;
  };
})(jQuery);
