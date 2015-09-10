// ==================== app actionController start @include ==================== //
    root.$watch('currentAction', function(currentAction) {
        if (currentAction !== void 0) {
            
            switch (currentAction) {

                // -------------------- onError start -------------------- //
                case 'onError':
                    avalon.log("Error!, Redirect to index!", arguments);
                    avalon.router.go("task.list");
                    break;
                // -------------------- onError end -------------------- //
            
                // -------------------- onBegin start -------------------- //
                case 'onBegin':
                    
                    break;
                // -------------------- onBegin end -------------------- //

                // -------------------- onLoad start -------------------- //
                case 'onLoad':

                    // var view = document.querySelector('[avalonctrl='+ root.currentState + ']');
                    // for strong
                    // view && view.classList.add(g_viewload_animation); /* jshint ignore:line */

                    break;
                // -------------------- onLoad end -------------------- //

                // -------------------- onBeforeUnload end -------------------- //
                case 'onBeforeUnload':
                    break;
                // -------------------- onBeforeUnload end -------------------- //

                // -------------------- onUnload start -------------------- //
                case 'onUnload':
                    break;
                // -------------------- onUnload end -------------------- //

            } // end of root.currentAction switch

        } // end of if
    }); // end of root.currentAction watcher
    // ==================== app actionController start @include ==================== //
