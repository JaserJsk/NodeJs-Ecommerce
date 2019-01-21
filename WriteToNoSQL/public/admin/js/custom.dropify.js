$(document).ready(function () {
    // Basic
    $('.dropify').dropify();

    // Translated
    $('.dropify-fr').dropify({
        messages: {
            default: 'Dra och släpp en fil här eller klicka',
            replace: 'Dra och släpp eller klicka för att ersätta',
            remove: 'Ta bort',
            error: 'Oj, något gick fel.'
        }
    });

    // Used events
    var drEvent = $('#input-file-events').dropify();

    drEvent.on('dropify.beforeClear', function (event, element) {
        return confirm("Do you really want to delete \"" + element.file.name + "\" ?");
    });

    drEvent.on('dropify.afterClear', function (event, element) {
        alert('File deleted');
    });

    drEvent.on('dropify.errors', function (event, element) {
        console.log('Has Errors');
    });

    var drDestroy = $('#input-file-to-destroy').dropify();
    drDestroy = drDestroy.data('dropify')
    $('#toggleDropify').on('click', function (e) {
        e.preventDefault();
        if (drDestroy.isDropified()) {
            drDestroy.destroy();
        } else {
            drDestroy.init();
        }
    })
});