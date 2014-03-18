techRadarApp.directive('categoryWIP', function ($document) {
    return function(scope, element, attr) {
        scope.title = '';

        element.css({
            position: 'relative',
            border: '1px solid red',
            backgroundColor: 'lightgrey',
            cursor: 'pointer'
        });
        scope.delete = function(category){
            console.log(category);
        }

    }
});
