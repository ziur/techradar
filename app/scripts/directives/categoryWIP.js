techRadarApp.directive('categoryWIP', function ($document) {
    return function(scope, element, attr) {
        var startX = 0, startY = 0, x = 0, y = 0;

        element.css({
            position: 'relative',
            border: '1px solid red',
            backgroundColor: 'lightgrey',
            cursor: 'pointer'
        });

        element.on('mousedown', function(event) {
            // Prevent default dragging of selected content
            event.preventDefault();

        });
    }
});
