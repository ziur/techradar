techRadarApp.directive('dualListBox', function() {
    return {
        restrict: 'A',
        scope: {},
        link: function(scope , element){
            element.bootstrapDualListbox({
                nonselectedlistlabel: 'Non-selected',
                selectedlistlabel: 'Selected',
                preserveselectiononmove: 'moved',
                moveonselect: false
            });
        }
    };
});