var RootPanel = new Class({
    Extends: VTouchWidget,

    initialize: function(){
        VTouchWidget.prototype.initialize.call(this, options);

        //this.volumePanel = this.root.add({ type: VolumePanel });
        this.clipMatrix = this.add({ type: ClipMatrix});
        
        this.clipMatrix.requestUpdate()
        this.touchtracker = new TouchTracker(this);
        /*this.mutePanel = this.add({ type: MuteButtonPanel});
        this.soloPanel = this.add({ type: SoloButtonPanel});
        this.armPanel = this.add({ type: ArmButtonPanel});
        */
       
        /*this.mutePanel = this.root.add({ 
            type: MuteButton,
            bgColor: "#FF0000",
            frontColor: "#FFFF00",
            labelColor: "#00FF00"
        });
        */        
    }
    
});