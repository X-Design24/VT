(function(){
    var script = {
 "scripts": {
  "unregisterKey": function(key){  delete window[key]; },
  "setMainMediaByIndex": function(index){  var item = undefined; if(index >= 0 && index < this.mainPlayList.get('items').length){ this.mainPlayList.set('selectedIndex', index); item = this.mainPlayList.get('items')[index]; } return item; },
  "triggerOverlay": function(overlay, eventName){  if(overlay.get('areas') != undefined) { var areas = overlay.get('areas'); for(var i = 0; i<areas.length; ++i) { areas[i].trigger(eventName); } } else { overlay.trigger(eventName); } },
  "setCameraSameSpotAsMedia": function(camera, media){  var player = this.getCurrentPlayerWithMedia(media); if(player != undefined) { var position = camera.get('initialPosition'); position.set('yaw', player.get('yaw')); position.set('pitch', player.get('pitch')); position.set('hfov', player.get('hfov')); } },
  "shareWhatsapp": function(url){  window.open('https://api.whatsapp.com/send/?text=' + encodeURIComponent(url), '_blank'); },
  "fixTogglePlayPauseButton": function(player){  var state = player.get('state'); var buttons = player.get('buttonPlayPause'); if(typeof buttons !== 'undefined' && player.get('state') == 'playing'){ if(!Array.isArray(buttons)) buttons = [buttons]; for(var i = 0; i<buttons.length; ++i) buttons[i].set('pressed', true); } },
  "updateMediaLabelFromPlayList": function(playList, htmlText, playListItemStopToDispose){  var changeFunction = function(){ var index = playList.get('selectedIndex'); if(index >= 0){ var beginFunction = function(){ playListItem.unbind('begin', beginFunction); setMediaLabel(index); }; var setMediaLabel = function(index){ var media = playListItem.get('media'); var text = media.get('data'); if(!text) text = media.get('label'); setHtml(text); }; var setHtml = function(text){ if(text !== undefined) { htmlText.set('html', '<div style=\"text-align:left\"><SPAN STYLE=\"color:#FFFFFF;font-size:12px;font-family:Verdana\"><span color=\"white\" font-family=\"Verdana\" font-size=\"12px\">' + text + '</SPAN></div>'); } else { htmlText.set('html', ''); } }; var playListItem = playList.get('items')[index]; if(htmlText.get('html')){ setHtml('Loading...'); playListItem.bind('begin', beginFunction); } else{ setMediaLabel(index); } } }; var disposeFunction = function(){ htmlText.set('html', undefined); playList.unbind('change', changeFunction, this); playListItemStopToDispose.unbind('stop', disposeFunction, this); }; if(playListItemStopToDispose){ playListItemStopToDispose.bind('stop', disposeFunction, this); } playList.bind('change', changeFunction, this); changeFunction(); },
  "startPanoramaWithCamera": function(media, camera){  if(window.currentPanoramasWithCameraChanged != undefined && window.currentPanoramasWithCameraChanged.indexOf(media) != -1){ return; } var playLists = this.getByClassName('PlayList'); if(playLists.length == 0) return; var restoreItems = []; for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media && (item.get('class') == 'PanoramaPlayListItem' || item.get('class') == 'Video360PlayListItem')){ restoreItems.push({camera: item.get('camera'), item: item}); item.set('camera', camera); } } } if(restoreItems.length > 0) { if(window.currentPanoramasWithCameraChanged == undefined) { window.currentPanoramasWithCameraChanged = [media]; } else { window.currentPanoramasWithCameraChanged.push(media); } var restoreCameraOnStop = function(){ var index = window.currentPanoramasWithCameraChanged.indexOf(media); if(index != -1) { window.currentPanoramasWithCameraChanged.splice(index, 1); } for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.set('camera', restoreItems[i].camera); restoreItems[i].item.unbind('stop', restoreCameraOnStop, this); } }; for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.bind('stop', restoreCameraOnStop, this); } } },
  "playAudioList": function(audios){  if(audios.length == 0) return; var currentAudioCount = -1; var currentAudio; var playGlobalAudioFunction = this.playGlobalAudio; var playNext = function(){ if(++currentAudioCount >= audios.length) currentAudioCount = 0; currentAudio = audios[currentAudioCount]; playGlobalAudioFunction(currentAudio, playNext); }; playNext(); },
  "setPanoramaCameraWithCurrentSpot": function(playListItem){  var currentPlayer = this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer == undefined){ return; } var playerClass = currentPlayer.get('class'); if(playerClass != 'PanoramaPlayer' && playerClass != 'Video360Player'){ return; } var fromMedia = currentPlayer.get('panorama'); if(fromMedia == undefined) { fromMedia = currentPlayer.get('video'); } var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, fromMedia); this.startPanoramaWithCamera(panorama, newCamera); },
  "showPopupPanoramaOverlay": function(popupPanoramaOverlay, closeButtonProperties, imageHD, toggleImage, toggleImageHD, autoCloseMilliSeconds, audio, stopBackgroundAudio){  var self = this; this.MainViewer.set('toolTipEnabled', false); var cardboardEnabled = this.isCardboardViewMode(); if(!cardboardEnabled) { var zoomImage = this.zoomImagePopupPanorama; var showDuration = popupPanoramaOverlay.get('showDuration'); var hideDuration = popupPanoramaOverlay.get('hideDuration'); var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); var popupMaxWidthBackup = popupPanoramaOverlay.get('popupMaxWidth'); var popupMaxHeightBackup = popupPanoramaOverlay.get('popupMaxHeight'); var showEndFunction = function() { var loadedFunction = function(){ if(!self.isCardboardViewMode()) popupPanoramaOverlay.set('visible', false); }; popupPanoramaOverlay.unbind('showEnd', showEndFunction, self); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', 1); self.showPopupImage(imageHD, toggleImageHD, popupPanoramaOverlay.get('popupMaxWidth'), popupPanoramaOverlay.get('popupMaxHeight'), null, null, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedFunction, hideFunction); }; var hideFunction = function() { var restoreShowDurationFunction = function(){ popupPanoramaOverlay.unbind('showEnd', restoreShowDurationFunction, self); popupPanoramaOverlay.set('visible', false); popupPanoramaOverlay.set('showDuration', showDuration); popupPanoramaOverlay.set('popupMaxWidth', popupMaxWidthBackup); popupPanoramaOverlay.set('popupMaxHeight', popupMaxHeightBackup); }; self.resumePlayers(playersPaused, audio == null || !stopBackgroundAudio); var currentWidth = zoomImage.get('imageWidth'); var currentHeight = zoomImage.get('imageHeight'); popupPanoramaOverlay.bind('showEnd', restoreShowDurationFunction, self, true); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', hideDuration); popupPanoramaOverlay.set('popupMaxWidth', currentWidth); popupPanoramaOverlay.set('popupMaxHeight', currentHeight); if(popupPanoramaOverlay.get('visible')) restoreShowDurationFunction(); else popupPanoramaOverlay.set('visible', true); self.MainViewer.set('toolTipEnabled', true); }; if(!imageHD){ imageHD = popupPanoramaOverlay.get('image'); } if(!toggleImageHD && toggleImage){ toggleImageHD = toggleImage; } popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); } else { var hideEndFunction = function() { self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } popupPanoramaOverlay.unbind('hideEnd', hideEndFunction, self); self.MainViewer.set('toolTipEnabled', true); }; var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } popupPanoramaOverlay.bind('hideEnd', hideEndFunction, this, true); } popupPanoramaOverlay.set('visible', true); },
  "showWindow": function(w, autoCloseMilliSeconds, containsAudio){  if(w.get('visible') == true){ return; } var closeFunction = function(){ clearAutoClose(); this.resumePlayers(playersPaused, !containsAudio); w.unbind('close', closeFunction, this); }; var clearAutoClose = function(){ w.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ w.hide(); }; w.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } var playersPaused = this.pauseCurrentPlayers(!containsAudio); w.bind('close', closeFunction, this); w.show(this, true); },
  "setMediaBehaviour": function(playList, index, mediaDispatcher){  var self = this; var stateChangeFunction = function(event){ if(event.data.state == 'stopped'){ dispose.call(this, true); } }; var onBeginFunction = function() { item.unbind('begin', onBeginFunction, self); var media = item.get('media'); if(media.get('class') != 'Panorama' || (media.get('camera') != undefined && media.get('camera').get('initialSequence') != undefined)){ player.bind('stateChange', stateChangeFunction, self); } }; var changeFunction = function(){ var index = playListDispatcher.get('selectedIndex'); if(index != -1){ indexDispatcher = index; dispose.call(this, false); } }; var disposeCallback = function(){ dispose.call(this, false); }; var dispose = function(forceDispose){ if(!playListDispatcher) return; var media = item.get('media'); if((media.get('class') == 'Video360' || media.get('class') == 'Video') && media.get('loop') == true && !forceDispose) return; playList.set('selectedIndex', -1); if(panoramaSequence && panoramaSequenceIndex != -1){ if(panoramaSequence) { if(panoramaSequenceIndex > 0 && panoramaSequence.get('movements')[panoramaSequenceIndex-1].get('class') == 'TargetPanoramaCameraMovement'){ var initialPosition = camera.get('initialPosition'); var oldYaw = initialPosition.get('yaw'); var oldPitch = initialPosition.get('pitch'); var oldHfov = initialPosition.get('hfov'); var previousMovement = panoramaSequence.get('movements')[panoramaSequenceIndex-1]; initialPosition.set('yaw', previousMovement.get('targetYaw')); initialPosition.set('pitch', previousMovement.get('targetPitch')); initialPosition.set('hfov', previousMovement.get('targetHfov')); var restoreInitialPositionFunction = function(event){ initialPosition.set('yaw', oldYaw); initialPosition.set('pitch', oldPitch); initialPosition.set('hfov', oldHfov); itemDispatcher.unbind('end', restoreInitialPositionFunction, this); }; itemDispatcher.bind('end', restoreInitialPositionFunction, this); } panoramaSequence.set('movementIndex', panoramaSequenceIndex); } } if(player){ item.unbind('begin', onBeginFunction, this); player.unbind('stateChange', stateChangeFunction, this); for(var i = 0; i<buttons.length; ++i) { buttons[i].unbind('click', disposeCallback, this); } } if(sameViewerArea){ var currentMedia = this.getMediaFromPlayer(player); if(currentMedia == undefined || currentMedia == item.get('media')){ playListDispatcher.set('selectedIndex', indexDispatcher); } if(playList != playListDispatcher) playListDispatcher.unbind('change', changeFunction, this); } else{ viewerArea.set('visible', viewerVisibility); } playListDispatcher = undefined; }; var mediaDispatcherByParam = mediaDispatcher != undefined; if(!mediaDispatcher){ var currentIndex = playList.get('selectedIndex'); var currentPlayer = (currentIndex != -1) ? playList.get('items')[playList.get('selectedIndex')].get('player') : this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer) { mediaDispatcher = this.getMediaFromPlayer(currentPlayer); } } var playListDispatcher = mediaDispatcher ? this.getPlayListWithMedia(mediaDispatcher, true) : undefined; if(!playListDispatcher){ playList.set('selectedIndex', index); return; } var indexDispatcher = playListDispatcher.get('selectedIndex'); if(playList.get('selectedIndex') == index || indexDispatcher == -1){ return; } var item = playList.get('items')[index]; var itemDispatcher = playListDispatcher.get('items')[indexDispatcher]; var player = item.get('player'); var viewerArea = player.get('viewerArea'); var viewerVisibility = viewerArea.get('visible'); var sameViewerArea = viewerArea == itemDispatcher.get('player').get('viewerArea'); if(sameViewerArea){ if(playList != playListDispatcher){ playListDispatcher.set('selectedIndex', -1); playListDispatcher.bind('change', changeFunction, this); } } else{ viewerArea.set('visible', true); } var panoramaSequenceIndex = -1; var panoramaSequence = undefined; var camera = itemDispatcher.get('camera'); if(camera){ panoramaSequence = camera.get('initialSequence'); if(panoramaSequence) { panoramaSequenceIndex = panoramaSequence.get('movementIndex'); } } playList.set('selectedIndex', index); var buttons = []; var addButtons = function(property){ var value = player.get(property); if(value == undefined) return; if(Array.isArray(value)) buttons = buttons.concat(value); else buttons.push(value); }; addButtons('buttonStop'); for(var i = 0; i<buttons.length; ++i) { buttons[i].bind('click', disposeCallback, this); } if(player != itemDispatcher.get('player') || !mediaDispatcherByParam){ item.bind('begin', onBeginFunction, self); } this.executeFunctionWhenChange(playList, index, disposeCallback); },
  "setMainMediaByName": function(name){  var items = this.mainPlayList.get('items'); for(var i = 0; i<items.length; ++i){ var item = items[i]; if(item.get('media').get('label') == name) { this.mainPlayList.set('selectedIndex', i); return item; } } },
  "getCurrentPlayerWithMedia": function(media){  var playerClass = undefined; var mediaPropertyName = undefined; switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'panorama'; break; case 'Video360': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'video'; break; case 'PhotoAlbum': playerClass = 'PhotoAlbumPlayer'; mediaPropertyName = 'photoAlbum'; break; case 'Map': playerClass = 'MapPlayer'; mediaPropertyName = 'map'; break; case 'Video': playerClass = 'VideoPlayer'; mediaPropertyName = 'video'; break; }; if(playerClass != undefined) { var players = this.getByClassName(playerClass); for(var i = 0; i<players.length; ++i){ var player = players[i]; if(player.get(mediaPropertyName) == media) { return player; } } } else { return undefined; } },
  "stopAndGoCamera": function(camera, ms){  var sequence = camera.get('initialSequence'); sequence.pause(); var timeoutFunction = function(){ sequence.play(); }; setTimeout(timeoutFunction, ms); },
  "setPanoramaCameraWithSpot": function(playListItem, yaw, pitch){  var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); var initialPosition = newCamera.get('initialPosition'); initialPosition.set('yaw', yaw); initialPosition.set('pitch', pitch); this.startPanoramaWithCamera(panorama, newCamera); },
  "getPlayListWithMedia": function(media, onlySelected){  var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(onlySelected && playList.get('selectedIndex') == -1) continue; if(this.getPlayListItemByMedia(playList, media) != undefined) return playList; } return undefined; },
  "getMediaFromPlayer": function(player){  switch(player.get('class')){ case 'PanoramaPlayer': return player.get('panorama') || player.get('video'); case 'VideoPlayer': case 'Video360Player': return player.get('video'); case 'PhotoAlbumPlayer': return player.get('photoAlbum'); case 'MapPlayer': return player.get('map'); } },
  "getKey": function(key){  return window[key]; },
  "changeBackgroundWhilePlay": function(playList, index, color){  var stopFunction = function(event){ playListItem.unbind('stop', stopFunction, this); if((color == viewerArea.get('backgroundColor')) && (colorRatios == viewerArea.get('backgroundColorRatios'))){ viewerArea.set('backgroundColor', backgroundColorBackup); viewerArea.set('backgroundColorRatios', backgroundColorRatiosBackup); } }; var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var viewerArea = player.get('viewerArea'); var backgroundColorBackup = viewerArea.get('backgroundColor'); var backgroundColorRatiosBackup = viewerArea.get('backgroundColorRatios'); var colorRatios = [0]; if((color != backgroundColorBackup) || (colorRatios != backgroundColorRatiosBackup)){ viewerArea.set('backgroundColor', color); viewerArea.set('backgroundColorRatios', colorRatios); playListItem.bind('stop', stopFunction, this); } },
  "pauseGlobalAudios": function(caller, exclude){  if (window.pauseGlobalAudiosState == undefined) window.pauseGlobalAudiosState = {}; if (window.pauseGlobalAudiosList == undefined) window.pauseGlobalAudiosList = []; if (caller in window.pauseGlobalAudiosState) { return; } var audios = this.getByClassName('Audio').concat(this.getByClassName('VideoPanoramaOverlay')); if (window.currentGlobalAudios != undefined) audios = audios.concat(Object.values(window.currentGlobalAudios)); var audiosPaused = []; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = 0; j<objAudios.length; ++j) { var a = objAudios[j]; if(audiosPaused.indexOf(a) == -1) audiosPaused.push(a); } } window.pauseGlobalAudiosState[caller] = audiosPaused; for (var i = 0, count = audios.length; i < count; ++i) { var a = audios[i]; if (a.get('state') == 'playing' && (exclude == undefined || exclude.indexOf(a) == -1)) { a.pause(); audiosPaused.push(a); } } },
  "pauseCurrentPlayers": function(onlyPauseCameraIfPanorama){  var players = this.getCurrentPlayers(); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('state') == 'playing') { if(onlyPauseCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.pauseCamera(); } else { player.pause(); } } else { players.splice(i, 1); } } return players; },
  "getPixels": function(value){  var result = new RegExp('((\\+|\\-)?\\d+(\\.\\d*)?)(px|vw|vh|vmin|vmax)?', 'i').exec(value); if (result == undefined) { return 0; } var num = parseFloat(result[1]); var unit = result[4]; var vw = this.rootPlayer.get('actualWidth') / 100; var vh = this.rootPlayer.get('actualHeight') / 100; switch(unit) { case 'vw': return num * vw; case 'vh': return num * vh; case 'vmin': return num * Math.min(vw, vh); case 'vmax': return num * Math.max(vw, vh); default: return num; } },
  "loopAlbum": function(playList, index){  var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var loopFunction = function(){ player.play(); }; this.executeFunctionWhenChange(playList, index, loopFunction); },
  "init": function(){  if(!Object.hasOwnProperty('values')) { Object.values = function(o){ return Object.keys(o).map(function(e) { return o[e]; }); }; } var history = this.get('data')['history']; var playListChangeFunc = function(e){ var playList = e.source; var index = playList.get('selectedIndex'); if(index < 0) return; var id = playList.get('id'); if(!history.hasOwnProperty(id)) history[id] = new HistoryData(playList); history[id].add(index); }; var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i) { var playList = playLists[i]; playList.bind('change', playListChangeFunc, this); } },
  "setEndToItemIndex": function(playList, fromIndex, toIndex){  var endFunction = function(){ if(playList.get('selectedIndex') == fromIndex) playList.set('selectedIndex', toIndex); }; this.executeFunctionWhenChange(playList, fromIndex, endFunction); },
  "loadFromCurrentMediaPlayList": function(playList, delta){  var currentIndex = playList.get('selectedIndex'); var totalItems = playList.get('items').length; var newIndex = (currentIndex + delta) % totalItems; while(newIndex < 0){ newIndex = totalItems + newIndex; }; if(currentIndex != newIndex){ playList.set('selectedIndex', newIndex); } },
  "showPopupPanoramaVideoOverlay": function(popupPanoramaOverlay, closeButtonProperties, stopAudios){  var self = this; var showEndFunction = function() { popupPanoramaOverlay.unbind('showEnd', showEndFunction); closeButton.bind('click', hideFunction, this); setCloseButtonPosition(); closeButton.set('visible', true); }; var endFunction = function() { if(!popupPanoramaOverlay.get('loop')) hideFunction(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); popupPanoramaOverlay.set('visible', false); closeButton.set('visible', false); closeButton.unbind('click', hideFunction, self); popupPanoramaOverlay.unbind('end', endFunction, self); popupPanoramaOverlay.unbind('hideEnd', hideFunction, self, true); self.resumePlayers(playersPaused, true); if(stopAudios) { self.resumeGlobalAudios(); } }; var setCloseButtonPosition = function() { var right = 10; var top = 10; closeButton.set('right', right); closeButton.set('top', top); }; this.MainViewer.set('toolTipEnabled', false); var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(true); if(stopAudios) { this.pauseGlobalAudios(); } popupPanoramaOverlay.bind('end', endFunction, this, true); popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); popupPanoramaOverlay.bind('hideEnd', hideFunction, this, true); popupPanoramaOverlay.set('visible', true); },
  "shareFacebook": function(url){  window.open('https://www.facebook.com/sharer/sharer.php?u=' + url, '_blank'); },
  "showPopupMedia": function(w, media, playList, popupMaxWidth, popupMaxHeight, autoCloseWhenFinished, stopAudios){  var self = this; var closeFunction = function(){ playList.set('selectedIndex', -1); self.MainViewer.set('toolTipEnabled', true); if(stopAudios) { self.resumeGlobalAudios(); } this.resumePlayers(playersPaused, !stopAudios); if(isVideo) { this.unbind('resize', resizeFunction, this); } w.unbind('close', closeFunction, this); }; var endFunction = function(){ w.hide(); }; var resizeFunction = function(){ var getWinValue = function(property){ return w.get(property) || 0; }; var parentWidth = self.get('actualWidth'); var parentHeight = self.get('actualHeight'); var mediaWidth = self.getMediaWidth(media); var mediaHeight = self.getMediaHeight(media); var popupMaxWidthNumber = parseFloat(popupMaxWidth) / 100; var popupMaxHeightNumber = parseFloat(popupMaxHeight) / 100; var windowWidth = popupMaxWidthNumber * parentWidth; var windowHeight = popupMaxHeightNumber * parentHeight; var footerHeight = getWinValue('footerHeight'); var headerHeight = getWinValue('headerHeight'); if(!headerHeight) { var closeButtonHeight = getWinValue('closeButtonIconHeight') + getWinValue('closeButtonPaddingTop') + getWinValue('closeButtonPaddingBottom'); var titleHeight = self.getPixels(getWinValue('titleFontSize')) + getWinValue('titlePaddingTop') + getWinValue('titlePaddingBottom'); headerHeight = closeButtonHeight > titleHeight ? closeButtonHeight : titleHeight; headerHeight += getWinValue('headerPaddingTop') + getWinValue('headerPaddingBottom'); } var contentWindowWidth = windowWidth - getWinValue('bodyPaddingLeft') - getWinValue('bodyPaddingRight') - getWinValue('paddingLeft') - getWinValue('paddingRight'); var contentWindowHeight = windowHeight - headerHeight - footerHeight - getWinValue('bodyPaddingTop') - getWinValue('bodyPaddingBottom') - getWinValue('paddingTop') - getWinValue('paddingBottom'); var parentAspectRatio = contentWindowWidth / contentWindowHeight; var mediaAspectRatio = mediaWidth / mediaHeight; if(parentAspectRatio > mediaAspectRatio) { windowWidth = contentWindowHeight * mediaAspectRatio + getWinValue('bodyPaddingLeft') + getWinValue('bodyPaddingRight') + getWinValue('paddingLeft') + getWinValue('paddingRight'); } else { windowHeight = contentWindowWidth / mediaAspectRatio + headerHeight + footerHeight + getWinValue('bodyPaddingTop') + getWinValue('bodyPaddingBottom') + getWinValue('paddingTop') + getWinValue('paddingBottom'); } if(windowWidth > parentWidth * popupMaxWidthNumber) { windowWidth = parentWidth * popupMaxWidthNumber; } if(windowHeight > parentHeight * popupMaxHeightNumber) { windowHeight = parentHeight * popupMaxHeightNumber; } w.set('width', windowWidth); w.set('height', windowHeight); w.set('x', (parentWidth - getWinValue('actualWidth')) * 0.5); w.set('y', (parentHeight - getWinValue('actualHeight')) * 0.5); }; if(autoCloseWhenFinished){ this.executeFunctionWhenChange(playList, 0, endFunction); } var mediaClass = media.get('class'); var isVideo = mediaClass == 'Video' || mediaClass == 'Video360'; playList.set('selectedIndex', 0); if(isVideo){ this.bind('resize', resizeFunction, this); resizeFunction(); playList.get('items')[0].get('player').play(); } else { w.set('width', popupMaxWidth); w.set('height', popupMaxHeight); } this.MainViewer.set('toolTipEnabled', false); if(stopAudios) { this.pauseGlobalAudios(); } var playersPaused = this.pauseCurrentPlayers(!stopAudios); w.bind('close', closeFunction, this); w.show(this, true); },
  "syncPlaylists": function(playLists){  var changeToMedia = function(media, playListDispatched){ for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(playList != playListDispatched){ var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ if(items[j].get('media') == media){ if(playList.get('selectedIndex') != j){ playList.set('selectedIndex', j); } break; } } } } }; var changeFunction = function(event){ var playListDispatched = event.source; var selectedIndex = playListDispatched.get('selectedIndex'); if(selectedIndex < 0) return; var media = playListDispatched.get('items')[selectedIndex].get('media'); changeToMedia(media, playListDispatched); }; var mapPlayerChangeFunction = function(event){ var panoramaMapLocation = event.source.get('panoramaMapLocation'); if(panoramaMapLocation){ var map = panoramaMapLocation.get('map'); changeToMedia(map); } }; for(var i = 0, count = playLists.length; i<count; ++i){ playLists[i].bind('change', changeFunction, this); } var mapPlayers = this.getByClassName('MapPlayer'); for(var i = 0, count = mapPlayers.length; i<count; ++i){ mapPlayers[i].bind('panoramaMapLocation_change', mapPlayerChangeFunction, this); } },
  "getComponentByName": function(name){  var list = this.getByClassName('UIComponent'); for(var i = 0, count = list.length; i<count; ++i){ var component = list[i]; var data = component.get('data'); if(data != undefined && data.name == name){ return component; } } return undefined; },
  "showComponentsWhileMouseOver": function(parentComponent, components, durationVisibleWhileOut){  var setVisibility = function(visible){ for(var i = 0, length = components.length; i<length; i++){ var component = components[i]; if(component.get('class') == 'HTMLText' && (component.get('html') == '' || component.get('html') == undefined)) { continue; } component.set('visible', visible); } }; if (this.rootPlayer.get('touchDevice') == true){ setVisibility(true); } else { var timeoutID = -1; var rollOverFunction = function(){ setVisibility(true); if(timeoutID >= 0) clearTimeout(timeoutID); parentComponent.unbind('rollOver', rollOverFunction, this); parentComponent.bind('rollOut', rollOutFunction, this); }; var rollOutFunction = function(){ var timeoutFunction = function(){ setVisibility(false); parentComponent.unbind('rollOver', rollOverFunction, this); }; parentComponent.unbind('rollOut', rollOutFunction, this); parentComponent.bind('rollOver', rollOverFunction, this); timeoutID = setTimeout(timeoutFunction, durationVisibleWhileOut); }; parentComponent.bind('rollOver', rollOverFunction, this); } },
  "stopGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; if(audio){ delete audios[audio.get('id')]; if(Object.keys(audios).length == 0){ window.currentGlobalAudios = undefined; } } } if(audio) audio.stop(); },
  "getMediaHeight": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxH=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('height') > maxH) maxH = r.get('height'); } return maxH; }else{ return r.get('height') } default: return media.get('height'); } },
  "resumePlayers": function(players, onlyResumeCameraIfPanorama){  for(var i = 0; i<players.length; ++i){ var player = players[i]; if(onlyResumeCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.resumeCamera(); } else{ player.play(); } } },
  "historyGoForward": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.forward(); } },
  "changePlayListWithSameSpot": function(playList, newIndex){  var currentIndex = playList.get('selectedIndex'); if (currentIndex >= 0 && newIndex >= 0 && currentIndex != newIndex) { var currentItem = playList.get('items')[currentIndex]; var newItem = playList.get('items')[newIndex]; var currentPlayer = currentItem.get('player'); var newPlayer = newItem.get('player'); if ((currentPlayer.get('class') == 'PanoramaPlayer' || currentPlayer.get('class') == 'Video360Player') && (newPlayer.get('class') == 'PanoramaPlayer' || newPlayer.get('class') == 'Video360Player')) { var newCamera = this.cloneCamera(newItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, currentItem.get('media')); this.startPanoramaWithCamera(newItem.get('media'), newCamera); } } },
  "getMediaByName": function(name){  var list = this.getByClassName('Media'); for(var i = 0, count = list.length; i<count; ++i){ var media = list[i]; if((media.get('class') == 'Audio' && media.get('data').label == name) || media.get('label') == name){ return media; } } return undefined; },
  "shareTwitter": function(url){  window.open('https://twitter.com/intent/tweet?source=webclient&url=' + url, '_blank'); },
  "autotriggerAtStart": function(playList, callback, once){  var onChange = function(event){ callback(); if(once == true) playList.unbind('change', onChange, this); }; playList.bind('change', onChange, this); },
  "setStartTimeVideoSync": function(video, player){  this.setStartTimeVideo(video, player.get('currentTime')); },
  "getGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios != undefined && audio.get('id') in audios){ audio = audios[audio.get('id')]; } return audio; },
  "getCurrentPlayers": function(){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); return players; },
  "cloneCamera": function(camera){  var newCamera = this.rootPlayer.createInstance(camera.get('class')); newCamera.set('id', camera.get('id') + '_copy'); newCamera.set('idleSequence', camera.get('initialSequence')); return newCamera; },
  "visibleComponentsIfPlayerFlagEnabled": function(components, playerFlag){  var enabled = this.get(playerFlag); for(var i in components){ components[i].set('visible', enabled); } },
  "keepComponentVisibility": function(component, keep){  var key = 'keepVisibility_' + component.get('id'); var value = this.getKey(key); if(value == undefined && keep) { this.registerKey(key, keep); } else if(value != undefined && !keep) { this.unregisterKey(key); } },
  "pauseGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; } if(audio.get('state') == 'playing') audio.pause(); },
  "registerKey": function(key, value){  window[key] = value; },
  "executeFunctionWhenChange": function(playList, index, endFunction, changeFunction){  var endObject = undefined; var changePlayListFunction = function(event){ if(event.data.previousSelectedIndex == index){ if(changeFunction) changeFunction.call(this); if(endFunction && endObject) endObject.unbind('end', endFunction, this); playList.unbind('change', changePlayListFunction, this); } }; if(endFunction){ var playListItem = playList.get('items')[index]; if(playListItem.get('class') == 'PanoramaPlayListItem'){ var camera = playListItem.get('camera'); if(camera != undefined) endObject = camera.get('initialSequence'); if(endObject == undefined) endObject = camera.get('idleSequence'); } else{ endObject = playListItem.get('media'); } if(endObject){ endObject.bind('end', endFunction, this); } } playList.bind('change', changePlayListFunction, this); },
  "getActivePlayerWithViewer": function(viewerArea){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); players = players.concat(this.getByClassName('MapPlayer')); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('viewerArea') == viewerArea) { var playerClass = player.get('class'); if(playerClass == 'PanoramaPlayer' && (player.get('panorama') != undefined || player.get('video') != undefined)) return player; else if((playerClass == 'VideoPlayer' || playerClass == 'Video360Player') && player.get('video') != undefined) return player; else if(playerClass == 'PhotoAlbumPlayer' && player.get('photoAlbum') != undefined) return player; else if(playerClass == 'MapPlayer' && player.get('map') != undefined) return player; } } return undefined; },
  "getPlayListItemByMedia": function(playList, media){  var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media) return item; } return undefined; },
  "isCardboardViewMode": function(){  var players = this.getByClassName('PanoramaPlayer'); return players.length > 0 && players[0].get('viewMode') == 'cardboard'; },
  "existsKey": function(key){  return key in window; },
  "resumeGlobalAudios": function(caller){  if (window.pauseGlobalAudiosState == undefined || !(caller in window.pauseGlobalAudiosState)) return; var audiosPaused = window.pauseGlobalAudiosState[caller]; delete window.pauseGlobalAudiosState[caller]; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = audiosPaused.length-1; j>=0; --j) { var a = audiosPaused[j]; if(objAudios.indexOf(a) != -1) audiosPaused.splice(j, 1); } } for (var i = 0, count = audiosPaused.length; i<count; ++i) { var a = audiosPaused[i]; if (a.get('state') == 'paused') a.play(); } },
  "getPanoramaOverlayByName": function(panorama, name){  var overlays = this.getOverlays(panorama); for(var i = 0, count = overlays.length; i<count; ++i){ var overlay = overlays[i]; var data = overlay.get('data'); if(data != undefined && data.label == name){ return overlay; } } return undefined; },
  "initGA": function(){  var sendFunc = function(category, event, label) { ga('send', 'event', category, event, label); }; var media = this.getByClassName('Panorama'); media = media.concat(this.getByClassName('Video360')); media = media.concat(this.getByClassName('Map')); for(var i = 0, countI = media.length; i<countI; ++i){ var m = media[i]; var mediaLabel = m.get('label'); var overlays = this.getOverlays(m); for(var j = 0, countJ = overlays.length; j<countJ; ++j){ var overlay = overlays[j]; var overlayLabel = overlay.get('data') != undefined ? mediaLabel + ' - ' + overlay.get('data')['label'] : mediaLabel; switch(overlay.get('class')) { case 'HotspotPanoramaOverlay': case 'HotspotMapOverlay': var areas = overlay.get('areas'); for (var z = 0; z<areas.length; ++z) { areas[z].bind('click', sendFunc.bind(this, 'Hotspot', 'click', overlayLabel), this); } break; case 'CeilingCapPanoramaOverlay': case 'TripodCapPanoramaOverlay': overlay.bind('click', sendFunc.bind(this, 'Cap', 'click', overlayLabel), this); break; } } } var components = this.getByClassName('Button'); components = components.concat(this.getByClassName('IconButton')); for(var i = 0, countI = components.length; i<countI; ++i){ var c = components[i]; var componentLabel = c.get('data')['name']; c.bind('click', sendFunc.bind(this, 'Skin', 'click', componentLabel), this); } var items = this.getByClassName('PlayListItem'); var media2Item = {}; for(var i = 0, countI = items.length; i<countI; ++i) { var item = items[i]; var media = item.get('media'); if(!(media.get('id') in media2Item)) { item.bind('begin', sendFunc.bind(this, 'Media', 'play', media.get('label')), this); media2Item[media.get('id')] = item; } } },
  "getOverlays": function(media){  switch(media.get('class')){ case 'Panorama': var overlays = media.get('overlays').concat() || []; var frames = media.get('frames'); for(var j = 0; j<frames.length; ++j){ overlays = overlays.concat(frames[j].get('overlays') || []); } return overlays; case 'Video360': case 'Map': return media.get('overlays') || []; default: return []; } },
  "pauseGlobalAudiosWhilePlayItem": function(playList, index, exclude){  var self = this; var item = playList.get('items')[index]; var media = item.get('media'); var player = item.get('player'); var caller = media.get('id'); var endFunc = function(){ if(playList.get('selectedIndex') != index) { if(hasState){ player.unbind('stateChange', stateChangeFunc, self); } self.resumeGlobalAudios(caller); } }; var stateChangeFunc = function(event){ var state = event.data.state; if(state == 'stopped'){ this.resumeGlobalAudios(caller); } else if(state == 'playing'){ this.pauseGlobalAudios(caller, exclude); } }; var mediaClass = media.get('class'); var hasState = mediaClass == 'Video360' || mediaClass == 'Video'; if(hasState){ player.bind('stateChange', stateChangeFunc, this); } this.pauseGlobalAudios(caller, exclude); this.executeFunctionWhenChange(playList, index, endFunc, endFunc); },
  "historyGoBack": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.back(); } },
  "setStartTimeVideo": function(video, time){  var items = this.getPlayListItems(video); var startTimeBackup = []; var restoreStartTimeFunc = function() { for(var i = 0; i<items.length; ++i){ var item = items[i]; item.set('startTime', startTimeBackup[i]); item.unbind('stop', restoreStartTimeFunc, this); } }; for(var i = 0; i<items.length; ++i) { var item = items[i]; var player = item.get('player'); if(player.get('video') == video && player.get('state') == 'playing') { player.seek(time); } else { startTimeBackup.push(item.get('startTime')); item.set('startTime', time); item.bind('stop', restoreStartTimeFunc, this); } } },
  "getPlayListItems": function(media, player){  var itemClass = (function() { switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': return 'PanoramaPlayListItem'; case 'Video360': return 'Video360PlayListItem'; case 'PhotoAlbum': return 'PhotoAlbumPlayListItem'; case 'Map': return 'MapPlayListItem'; case 'Video': return 'VideoPlayListItem'; } })(); if (itemClass != undefined) { var items = this.getByClassName(itemClass); for (var i = items.length-1; i>=0; --i) { var item = items[i]; if(item.get('media') != media || (player != undefined && item.get('player') != player)) { items.splice(i, 1); } } return items; } else { return []; } },
  "setComponentVisibility": function(component, visible, applyAt, effect, propertyEffect, ignoreClearTimeout){  var keepVisibility = this.getKey('keepVisibility_' + component.get('id')); if(keepVisibility) return; this.unregisterKey('visibility_'+component.get('id')); var changeVisibility = function(){ if(effect && propertyEffect){ component.set(propertyEffect, effect); } component.set('visible', visible); if(component.get('class') == 'ViewerArea'){ try{ if(visible) component.restart(); else if(component.get('playbackState') == 'playing') component.pause(); } catch(e){}; } }; var effectTimeoutName = 'effectTimeout_'+component.get('id'); if(!ignoreClearTimeout && window.hasOwnProperty(effectTimeoutName)){ var effectTimeout = window[effectTimeoutName]; if(effectTimeout instanceof Array){ for(var i=0; i<effectTimeout.length; i++){ clearTimeout(effectTimeout[i]) } }else{ clearTimeout(effectTimeout); } delete window[effectTimeoutName]; } else if(visible == component.get('visible') && !ignoreClearTimeout) return; if(applyAt && applyAt > 0){ var effectTimeout = setTimeout(function(){ if(window[effectTimeoutName] instanceof Array) { var arrayTimeoutVal = window[effectTimeoutName]; var index = arrayTimeoutVal.indexOf(effectTimeout); arrayTimeoutVal.splice(index, 1); if(arrayTimeoutVal.length == 0){ delete window[effectTimeoutName]; } }else{ delete window[effectTimeoutName]; } changeVisibility(); }, applyAt); if(window.hasOwnProperty(effectTimeoutName)){ window[effectTimeoutName] = [window[effectTimeoutName], effectTimeout]; }else{ window[effectTimeoutName] = effectTimeout; } } else{ changeVisibility(); } },
  "playGlobalAudio": function(audio, endCallback){  var endFunction = function(){ audio.unbind('end', endFunction, this); this.stopGlobalAudio(audio); if(endCallback) endCallback(); }; audio = this.getGlobalAudio(audio); var audios = window.currentGlobalAudios; if(!audios){ audios = window.currentGlobalAudios = {}; } audios[audio.get('id')] = audio; if(audio.get('state') == 'playing'){ return audio; } if(!audio.get('loop')){ audio.bind('end', endFunction, this); } audio.play(); return audio; },
  "getMediaWidth": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxW=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('width') > maxW) maxW = r.get('width'); } return maxW; }else{ return r.get('width') } default: return media.get('width'); } },
  "updateVideoCues": function(playList, index){  var playListItem = playList.get('items')[index]; var video = playListItem.get('media'); if(video.get('cues').length == 0) return; var player = playListItem.get('player'); var cues = []; var changeFunction = function(){ if(playList.get('selectedIndex') != index){ video.unbind('cueChange', cueChangeFunction, this); playList.unbind('change', changeFunction, this); } }; var cueChangeFunction = function(event){ var activeCues = event.data.activeCues; for(var i = 0, count = cues.length; i<count; ++i){ var cue = cues[i]; if(activeCues.indexOf(cue) == -1 && (cue.get('startTime') > player.get('currentTime') || cue.get('endTime') < player.get('currentTime')+0.5)){ cue.trigger('end'); } } cues = activeCues; }; video.bind('cueChange', cueChangeFunction, this); playList.bind('change', changeFunction, this); },
  "setMapLocation": function(panoramaPlayListItem, mapPlayer){  var resetFunction = function(){ panoramaPlayListItem.unbind('stop', resetFunction, this); player.set('mapPlayer', null); }; panoramaPlayListItem.bind('stop', resetFunction, this); var player = panoramaPlayListItem.get('player'); player.set('mapPlayer', mapPlayer); },
  "showPopupImage": function(image, toggleImage, customWidth, customHeight, showEffect, hideEffect, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedCallback, hideCallback){  var self = this; var closed = false; var playerClickFunction = function() { zoomImage.unbind('loaded', loadedFunction, self); hideFunction(); }; var clearAutoClose = function(){ zoomImage.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var resizeFunction = function(){ setTimeout(setCloseButtonPosition, 0); }; var loadedFunction = function(){ self.unbind('click', playerClickFunction, self); veil.set('visible', true); setCloseButtonPosition(); closeButton.set('visible', true); zoomImage.unbind('loaded', loadedFunction, this); zoomImage.bind('userInteractionStart', userInteractionStartFunction, this); zoomImage.bind('userInteractionEnd', userInteractionEndFunction, this); zoomImage.bind('resize', resizeFunction, this); timeoutID = setTimeout(timeoutFunction, 200); }; var timeoutFunction = function(){ timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ hideFunction(); }; zoomImage.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } zoomImage.bind('backgroundClick', hideFunction, this); if(toggleImage) { zoomImage.bind('click', toggleFunction, this); zoomImage.set('imageCursor', 'hand'); } closeButton.bind('click', hideFunction, this); if(loadedCallback) loadedCallback(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); closed = true; if(timeoutID) clearTimeout(timeoutID); if (timeoutUserInteractionID) clearTimeout(timeoutUserInteractionID); if(autoCloseMilliSeconds) clearAutoClose(); if(hideCallback) hideCallback(); zoomImage.set('visible', false); if(hideEffect && hideEffect.get('duration') > 0){ hideEffect.bind('end', endEffectFunction, this); } else{ zoomImage.set('image', null); } closeButton.set('visible', false); veil.set('visible', false); self.unbind('click', playerClickFunction, self); zoomImage.unbind('backgroundClick', hideFunction, this); zoomImage.unbind('userInteractionStart', userInteractionStartFunction, this); zoomImage.unbind('userInteractionEnd', userInteractionEndFunction, this, true); zoomImage.unbind('resize', resizeFunction, this); if(toggleImage) { zoomImage.unbind('click', toggleFunction, this); zoomImage.set('cursor', 'default'); } closeButton.unbind('click', hideFunction, this); self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } }; var endEffectFunction = function() { zoomImage.set('image', null); hideEffect.unbind('end', endEffectFunction, this); }; var toggleFunction = function() { zoomImage.set('image', isToggleVisible() ? image : toggleImage); }; var isToggleVisible = function() { return zoomImage.get('image') == toggleImage; }; var setCloseButtonPosition = function() { var right = zoomImage.get('actualWidth') - zoomImage.get('imageLeft') - zoomImage.get('imageWidth') + 10; var top = zoomImage.get('imageTop') + 10; if(right < 10) right = 10; if(top < 10) top = 10; closeButton.set('right', right); closeButton.set('top', top); }; var userInteractionStartFunction = function() { if(timeoutUserInteractionID){ clearTimeout(timeoutUserInteractionID); timeoutUserInteractionID = undefined; } else{ closeButton.set('visible', false); } }; var userInteractionEndFunction = function() { if(!closed){ timeoutUserInteractionID = setTimeout(userInteractionTimeoutFunction, 300); } }; var userInteractionTimeoutFunction = function() { timeoutUserInteractionID = undefined; closeButton.set('visible', true); setCloseButtonPosition(); }; this.MainViewer.set('toolTipEnabled', false); var veil = this.veilPopupPanorama; var zoomImage = this.zoomImagePopupPanorama; var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } var timeoutID = undefined; var timeoutUserInteractionID = undefined; zoomImage.bind('loaded', loadedFunction, this); setTimeout(function(){ self.bind('click', playerClickFunction, self, false); }, 0); zoomImage.set('image', image); zoomImage.set('customWidth', customWidth); zoomImage.set('customHeight', customHeight); zoomImage.set('showEffect', showEffect); zoomImage.set('hideEffect', hideEffect); zoomImage.set('visible', true); return zoomImage; },
  "playGlobalAudioWhilePlay": function(playList, index, audio, endCallback){  var changeFunction = function(event){ if(event.data.previousSelectedIndex == index){ this.stopGlobalAudio(audio); if(isPanorama) { var media = playListItem.get('media'); var audios = media.get('audios'); audios.splice(audios.indexOf(audio), 1); media.set('audios', audios); } playList.unbind('change', changeFunction, this); if(endCallback) endCallback(); } }; var audios = window.currentGlobalAudios; if(audios && audio.get('id') in audios){ audio = audios[audio.get('id')]; if(audio.get('state') != 'playing'){ audio.play(); } return audio; } playList.bind('change', changeFunction, this); var playListItem = playList.get('items')[index]; var isPanorama = playListItem.get('class') == 'PanoramaPlayListItem'; if(isPanorama) { var media = playListItem.get('media'); var audios = (media.get('audios') || []).slice(); if(audio.get('class') == 'MediaAudio') { var panoramaAudio = this.rootPlayer.createInstance('PanoramaAudio'); panoramaAudio.set('autoplay', false); panoramaAudio.set('audio', audio.get('audio')); panoramaAudio.set('loop', audio.get('loop')); panoramaAudio.set('id', audio.get('id')); var stateChangeFunctions = audio.getBindings('stateChange'); for(var i = 0; i<stateChangeFunctions.length; ++i){ var f = stateChangeFunctions[i]; if(typeof f == 'string') f = new Function('event', f); panoramaAudio.bind('stateChange', f, this); } audio = panoramaAudio; } audios.push(audio); media.set('audios', audios); } return this.playGlobalAudio(audio, endCallback); },
  "openLink": function(url, name){  if(url == location.href) { return; } var isElectron = (window && window.process && window.process.versions && window.process.versions['electron']) || (navigator && navigator.userAgent && navigator.userAgent.indexOf('Electron') >= 0); if (name == '_blank' && isElectron) { if (url.startsWith('/')) { var r = window.location.href.split('/'); r.pop(); url = r.join('/') + url; } var extension = url.split('.').pop().toLowerCase(); if(extension != 'pdf' || url.startsWith('file://')) { var shell = window.require('electron').shell; shell.openExternal(url); } else { window.open(url, name); } } else if(isElectron && (name == '_top' || name == '_self')) { window.location = url; } else { var newWindow = window.open(url, name); newWindow.focus(); } },
  "setOverlayBehaviour": function(overlay, media, action){  var executeFunc = function() { switch(action){ case 'triggerClick': this.triggerOverlay(overlay, 'click'); break; case 'stop': case 'play': case 'pause': overlay[action](); break; case 'togglePlayPause': case 'togglePlayStop': if(overlay.get('state') == 'playing') overlay[action == 'togglePlayPause' ? 'pause' : 'stop'](); else overlay.play(); break; } if(window.overlaysDispatched == undefined) window.overlaysDispatched = {}; var id = overlay.get('id'); window.overlaysDispatched[id] = true; setTimeout(function(){ delete window.overlaysDispatched[id]; }, 2000); }; if(window.overlaysDispatched != undefined && overlay.get('id') in window.overlaysDispatched) return; var playList = this.getPlayListWithMedia(media, true); if(playList != undefined){ var item = this.getPlayListItemByMedia(playList, media); if(playList.get('items').indexOf(item) != playList.get('selectedIndex')){ var beginFunc = function(e){ item.unbind('begin', beginFunc, this); executeFunc.call(this); }; item.bind('begin', beginFunc, this); return; } } executeFunc.call(this); }
 },
 "start": "this.playAudioList([this.audio_53B75033_4983_FCD3_41D2_0BFD85104AAF]); this.init(); this.visibleComponentsIfPlayerFlagEnabled([this.IconButton_EE9FBAB2_E389_8E06_41D7_903ABEDD153A], 'gyroscopeAvailable'); this.syncPlaylists([this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist,this.mainPlayList]); this.playList_4503F798_5371_F5DB_41D4_8A6439B5696B.set('selectedIndex', 0); if(!this.get('fullscreenAvailable')) { [this.IconButton_EEFF957A_E389_9A06_41E1_2AD21904F8C0].forEach(function(component) { component.set('visible', false); }) }",
 "horizontalAlign": "left",
 "children": [
  "this.MainViewer",
  "this.Container_7F59BED9_7065_6DCD_41D6_B4AD3EEA9174",
  "this.Container_EF8F8BD8_E386_8E03_41E3_4CF7CC1F4D8E",
  "this.Container_22BB12F4_3075_D173_4184_EC3BC4955417",
  "this.Container_062AB830_1140_E215_41AF_6C9D65345420",
  "this.Container_39DE87B1_0C06_62AF_417B_8CB0FB5C9D15",
  "this.Container_221B1648_0C06_E5FD_417F_E6FCCCB4A6D7",
  "this.Container_2F8BB687_0D4F_6B7F_4190_9490D02FBC41",
  "this.Container_2A1A5C4D_0D3B_DFF0_41A9_8FC811D03C8E",
  "this.Container_06C41BA5_1140_A63F_41AE_B0CBD78DEFDC"
 ],
 "height": "100%",
 "id": "rootPlayer",
 "width": "100%",
 "class": "Player",
 "overflow": "visible",
 "mouseWheelEnabled": true,
 "borderRadius": 0,
 "minHeight": 20,
 "scrollBarWidth": 10,
 "definitions": [{
 "items": [
  {
   "begin": "this.MapViewerMapPlayer.set('movementMode', 'free_drag_and_rotation')",
   "media": "this.map_3D35B000_2D00_6AE3_41B3_814517E43860",
   "player": "this.MapViewerMapPlayer",
   "class": "MapPlayListItem"
  }
 ],
 "id": "playList_4503F798_5371_F5DB_41D4_8A6439B5696B",
 "class": "PlayList"
},
{
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_21AC5DF8_2D00_3522_4192_F1EC0575A351_0/f/0/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_21AC5DF8_2D00_3522_4192_F1EC0575A351_0/f/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_21AC5DF8_2D00_3522_4192_F1EC0575A351_0/f/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_21AC5DF8_2D00_3522_4192_F1EC0575A351_0/u/0/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_21AC5DF8_2D00_3522_4192_F1EC0575A351_0/u/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_21AC5DF8_2D00_3522_4192_F1EC0575A351_0/u/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_21AC5DF8_2D00_3522_4192_F1EC0575A351_0/r/0/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_21AC5DF8_2D00_3522_4192_F1EC0575A351_0/r/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_21AC5DF8_2D00_3522_4192_F1EC0575A351_0/r/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_21AC5DF8_2D00_3522_4192_F1EC0575A351_0/b/0/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_21AC5DF8_2D00_3522_4192_F1EC0575A351_0/b/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_21AC5DF8_2D00_3522_4192_F1EC0575A351_0/b/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_21AC5DF8_2D00_3522_4192_F1EC0575A351_t.jpg",
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_21AC5DF8_2D00_3522_4192_F1EC0575A351_0/d/0/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_21AC5DF8_2D00_3522_4192_F1EC0575A351_0/d/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_21AC5DF8_2D00_3522_4192_F1EC0575A351_0/d/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_21AC5DF8_2D00_3522_4192_F1EC0575A351_0/l/0/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_21AC5DF8_2D00_3522_4192_F1EC0575A351_0/l/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_21AC5DF8_2D00_3522_4192_F1EC0575A351_0/l/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "label": "Pengeringan",
 "hfovMin": "150%",
 "id": "panorama_21AC5DF8_2D00_3522_4192_F1EC0575A351",
 "class": "Panorama",
 "overlays": [
  "this.overlay_394392FE_2D00_EF1E_41C3_461886C27F62",
  "this.overlay_397E4AC6_2D00_5F6F_41BE_D3ACEDC155E4",
  "this.overlay_27EBEE37_3500_CE13_41AE_3958C14C1E2A",
  "this.panorama_21AC5DF8_2D00_3522_4192_F1EC0575A351_tcap0",
  "this.panorama_21AC5DF8_2D00_3522_4192_F1EC0575A351_ccap0"
 ],
 "partial": false,
 "adjacentPanoramas": [
  {
   "backwardYaw": -75.62,
   "yaw": -18.16,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_20049CCB_2D00_5B65_41B2_9F7305A7E252"
  },
  {
   "backwardYaw": 84.71,
   "yaw": -70.11,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_24534248_3300_367C_4193_B77F834C5911"
  }
 ],
 "hfov": 360,
 "pitch": 0,
 "cardboardMenu": "this.Menu_450B479C_5371_F5DA_41C7_FAB497C358D4",
 "vfov": 180,
 "thumbnailUrl": "media/panorama_21AC5DF8_2D00_3522_4192_F1EC0575A351_t.jpg",
 "hfovMax": 130
},
{
 "initialPosition": {
  "yaw": 167.23,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "targetYaw": 0,
    "class": "TargetPanoramaCameraMovement",
    "path": "shortest",
    "targetPitch": 0,
    "pitchSpeed": 19.44,
    "easing": "cubic_in_out",
    "yawSpeed": 38.05
   },
   {
    "targetYaw": -145.5,
    "class": "TargetPanoramaCameraMovement",
    "path": "shortest",
    "targetPitch": 4.36,
    "pitchSpeed": 17.05,
    "easing": "cubic_in_out",
    "yawSpeed": 33.25
   },
   {
    "targetYaw": 120.82,
    "class": "TargetPanoramaCameraMovement",
    "path": "shortest",
    "targetPitch": -9.87,
    "pitchSpeed": 17.05,
    "easing": "cubic_in_out",
    "yawSpeed": 33.25
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_44E138E5_5371_FB75_41A0_6ED45B88BC82",
 "automaticZoomSpeed": 10
},
{
 "buttonCardboardView": "this.IconButton_EF7806FA_E38F_8606_41E5_5C4557EBCACB",
 "buttonToggleHotspots": "this.IconButton_EEEB3760_E38B_8603_41D6_FE6B11A3DA96",
 "buttonToggleGyroscope": "this.IconButton_EE9FBAB2_E389_8E06_41D7_903ABEDD153A",
 "class": "PanoramaPlayer",
 "viewerArea": "this.MainViewer",
 "gyroscopeVerticalDraggingEnabled": true,
 "id": "MainViewerPanoramaPlayer",
 "touchControlMode": "drag_rotation",
 "mouseControlMode": "drag_acceleration",
 "displayPlaybackBar": true
},
{
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "targetYaw": 102.37,
    "class": "TargetPanoramaCameraMovement",
    "path": "shortest",
    "targetPitch": 3.45,
    "pitchSpeed": 17.05,
    "easing": "cubic_in_out",
    "yawSpeed": 33.25
   },
   {
    "targetYaw": -104.64,
    "class": "TargetPanoramaCameraMovement",
    "path": "shortest",
    "targetPitch": 1.34,
    "pitchSpeed": 17.05,
    "easing": "cubic_in_out",
    "yawSpeed": 33.25
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_21AC062D_2D1F_D73D_41A5_DB9BD2F0AB93_camera",
 "automaticZoomSpeed": 10
},
{
 "items": [
  {
   "media": "this.panorama_20049CCB_2D00_5B65_41B2_9F7305A7E252",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 0, 1)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_20049CCB_2D00_5B65_41B2_9F7305A7E252_camera"
  },
  {
   "media": "this.panorama_2183758B_2D00_35E6_41AB_8B264F8B31F8",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 1, 2)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_2183758B_2D00_35E6_41AB_8B264F8B31F8_camera"
  },
  {
   "media": "this.panorama_21AC5DF8_2D00_3522_4192_F1EC0575A351",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 2, 3)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_21AC5DF8_2D00_3522_4192_F1EC0575A351_camera"
  },
  {
   "media": "this.panorama_21AC062D_2D1F_D73D_41A5_DB9BD2F0AB93",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 3, 4)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_21AC062D_2D1F_D73D_41A5_DB9BD2F0AB93_camera"
  },
  {
   "media": "this.panorama_21ADDE3C_2D1F_D722_41BE_FEAA4D868562",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 4, 5)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_21ADDE3C_2D1F_D722_41BE_FEAA4D868562_camera"
  },
  {
   "media": "this.panorama_21AC564D_2D1F_F762_41C4_CE95FB3A18CF",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 5, 6)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_21AC564D_2D1F_F762_41C4_CE95FB3A18CF_camera"
  },
  {
   "media": "this.panorama_24534248_3300_367C_4193_B77F834C5911",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 6, 7)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_24534248_3300_367C_4193_B77F834C5911_camera"
  },
  {
   "media": "this.panorama_25DD65E0_3303_F22C_41B8_CCEDFF035B4E",
   "end": "this.trigger('tourEnded')",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 7, 0)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_25DD65E0_3303_F22C_41B8_CCEDFF035B4E_camera"
  }
 ],
 "id": "mainPlayList",
 "class": "PlayList"
},
{
 "titleFontColor": "#000000",
 "shadowSpread": 1,
 "horizontalAlign": "center",
 "id": "window_42E87399_5009_441F_41BE_8E383A332C38",
 "width": 400,
 "backgroundOpacity": 1,
 "closeButtonBorderColor": "#000000",
 "closeButtonIconHeight": 12,
 "class": "Window",
 "overflow": "scroll",
 "closeButtonBackgroundColorDirection": "vertical",
 "footerBackgroundColorDirection": "vertical",
 "closeButtonRollOverBackgroundColor": [
  "#C13535"
 ],
 "titlePaddingRight": 5,
 "closeButtonRollOverBackgroundColorRatios": [
  0
 ],
 "titlePaddingTop": 5,
 "minHeight": 20,
 "veilColorDirection": "horizontal",
 "headerBorderSize": 0,
 "modal": true,
 "scrollBarWidth": 10,
 "scrollBarMargin": 2,
 "headerBorderColor": "#000000",
 "propagateClick": false,
 "verticalAlign": "middle",
 "footerBackgroundColor": [
  "#FFFFFF",
  "#EEEEEE",
  "#DDDDDD"
 ],
 "titlePaddingBottom": 5,
 "paddingRight": 0,
 "closeButtonPressedBackgroundColorRatios": [
  0
 ],
 "backgroundColor": [],
 "footerBackgroundColorRatios": [
  0,
  0.9,
  1
 ],
 "titleFontWeight": "normal",
 "bodyBackgroundOpacity": 1,
 "minWidth": 20,
 "shadowVerticalLength": 0,
 "title": "WC & KAMAR MANDI",
 "borderSize": 0,
 "height": 600,
 "headerPaddingLeft": 10,
 "titleFontStyle": "normal",
 "bodyBackgroundColor": [
  "#FFFFFF",
  "#DDDDDD",
  "#FFFFFF"
 ],
 "bodyPaddingLeft": 5,
 "contentOpaque": false,
 "footerHeight": 5,
 "headerPaddingRight": 10,
 "shadow": true,
 "hideEffect": {
  "class": "FadeOutEffect",
  "duration": 500,
  "easing": "cubic_in_out"
 },
 "scrollBarColor": "#000000",
 "backgroundColorDirection": "vertical",
 "headerBackgroundOpacity": 1,
 "headerBackgroundColor": [
  "#DDDDDD",
  "#EEEEEE",
  "#FFFFFF"
 ],
 "closeButtonPaddingRight": 0,
 "bodyBorderColor": "#000000",
 "footerBorderColor": "#000000",
 "veilShowEffect": {
  "class": "FadeInEffect",
  "duration": 500,
  "easing": "cubic_in_out"
 },
 "bodyBackgroundColorRatios": [
  0,
  0.5,
  1
 ],
 "closeButtonBackgroundColorRatios": [],
 "scrollBarOpacity": 0.5,
 "titleTextDecoration": "none",
 "closeButtonIconLineWidth": 2,
 "closeButtonPaddingLeft": 0,
 "bodyPaddingTop": 5,
 "children": [
  "this.htmlText_42E9A399_5009_441F_41B4_032E07CFD1AC"
 ],
 "veilColor": [
  "#000000",
  "#000000"
 ],
 "shadowBlurRadius": 6,
 "scrollBarVisible": "rollOver",
 "shadowColor": "#000000",
 "headerPaddingTop": 10,
 "veilColorRatios": [
  0,
  1
 ],
 "closeButtonRollOverIconColor": "#FFFFFF",
 "closeButtonBorderSize": 0,
 "closeButtonBorderRadius": 11,
 "layout": "vertical",
 "shadowOpacity": 0.5,
 "closeButtonBackgroundOpacity": 1,
 "bodyBackgroundColorDirection": "vertical",
 "borderRadius": 5,
 "closeButtonPaddingBottom": 0,
 "veilHideEffect": {
  "class": "FadeOutEffect",
  "duration": 500,
  "easing": "cubic_in_out"
 },
 "backgroundColorRatios": [],
 "headerPaddingBottom": 10,
 "titleFontSize": "2vmin",
 "footerBackgroundOpacity": 1,
 "headerBackgroundColorRatios": [
  0,
  0.1,
  1
 ],
 "closeButtonPressedIconColor": "#FFFFFF",
 "closeButtonIconWidth": 12,
 "titlePaddingLeft": 5,
 "veilOpacity": 0.4,
 "closeButtonPressedBackgroundColor": [
  "#3A1D1F"
 ],
 "footerBorderSize": 0,
 "gap": 10,
 "paddingBottom": 0,
 "closeButtonIconColor": "#000000",
 "paddingTop": 0,
 "headerVerticalAlign": "middle",
 "bodyPaddingBottom": 5,
 "bodyPaddingRight": 5,
 "showEffect": {
  "class": "FadeInEffect",
  "duration": 500,
  "easing": "cubic_in_out"
 },
 "bodyBorderSize": 0,
 "shadowHorizontalLength": 3,
 "closeButtonPaddingTop": 0,
 "headerBackgroundColorDirection": "vertical",
 "data": {
  "name": "Window5509"
 },
 "titleFontFamily": "Arial",
 "closeButtonBackgroundColor": [],
 "paddingLeft": 0
},
{
 "items": [
  {
   "media": "this.panorama_20049CCB_2D00_5B65_41B2_9F7305A7E252",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 0, 1)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_20049CCB_2D00_5B65_41B2_9F7305A7E252_camera"
  },
  {
   "media": "this.panorama_2183758B_2D00_35E6_41AB_8B264F8B31F8",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 1, 2)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_2183758B_2D00_35E6_41AB_8B264F8B31F8_camera"
  },
  {
   "media": "this.panorama_21AC5DF8_2D00_3522_4192_F1EC0575A351",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 2, 3)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_21AC5DF8_2D00_3522_4192_F1EC0575A351_camera"
  },
  {
   "media": "this.panorama_21AC062D_2D1F_D73D_41A5_DB9BD2F0AB93",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 3, 4)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_21AC062D_2D1F_D73D_41A5_DB9BD2F0AB93_camera"
  },
  {
   "media": "this.panorama_21ADDE3C_2D1F_D722_41BE_FEAA4D868562",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 4, 5)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_21ADDE3C_2D1F_D722_41BE_FEAA4D868562_camera"
  },
  {
   "media": "this.panorama_21AC564D_2D1F_F762_41C4_CE95FB3A18CF",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 5, 6)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_21AC564D_2D1F_F762_41C4_CE95FB3A18CF_camera"
  },
  {
   "media": "this.panorama_24534248_3300_367C_4193_B77F834C5911",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 6, 7)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_24534248_3300_367C_4193_B77F834C5911_camera"
  },
  {
   "media": "this.panorama_25DD65E0_3303_F22C_41B8_CCEDFF035B4E",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 7, 0)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_25DD65E0_3303_F22C_41B8_CCEDFF035B4E_camera"
  }
 ],
 "id": "ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist",
 "class": "PlayList"
},
{
 "initialPosition": {
  "yaw": 161.84,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "targetYaw": 65.94,
    "class": "TargetPanoramaCameraMovement",
    "path": "shortest",
    "targetPitch": -6.7,
    "pitchSpeed": 24.44,
    "easing": "cubic_in_out",
    "yawSpeed": 48.11
   },
   {
    "targetYaw": 131.74,
    "class": "TargetPanoramaCameraMovement",
    "path": "shortest",
    "targetPitch": -5.61,
    "pitchSpeed": 17.05,
    "easing": "cubic_in_out",
    "yawSpeed": 33.25
   },
   {
    "targetYaw": -96.17,
    "class": "TargetPanoramaCameraMovement",
    "path": "shortest",
    "targetPitch": 0.11,
    "pitchSpeed": 17.05,
    "easing": "cubic_in_out",
    "yawSpeed": 33.25
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_444888AF_5371_FBF6_413E_9DBD86016E90",
 "automaticZoomSpeed": 10
},
{
 "titleFontColor": "#000000",
 "shadowSpread": 1,
 "horizontalAlign": "center",
 "id": "window_5F50B74B_498E_C4B3_41BC_383BC9D585C8",
 "width": 400,
 "backgroundOpacity": 1,
 "closeButtonBorderColor": "#000000",
 "closeButtonIconHeight": 12,
 "class": "Window",
 "overflow": "scroll",
 "closeButtonBackgroundColorDirection": "vertical",
 "footerBackgroundColorDirection": "vertical",
 "closeButtonRollOverBackgroundColor": [
  "#C13535"
 ],
 "titlePaddingRight": 5,
 "closeButtonRollOverBackgroundColorRatios": [
  0
 ],
 "titlePaddingTop": 5,
 "minHeight": 20,
 "veilColorDirection": "horizontal",
 "headerBorderSize": 0,
 "modal": true,
 "scrollBarWidth": 10,
 "scrollBarMargin": 2,
 "headerBorderColor": "#000000",
 "propagateClick": false,
 "verticalAlign": "middle",
 "footerBackgroundColor": [
  "#FFFFFF",
  "#EEEEEE",
  "#DDDDDD"
 ],
 "titlePaddingBottom": 5,
 "paddingRight": 0,
 "closeButtonPressedBackgroundColorRatios": [
  0
 ],
 "backgroundColor": [],
 "footerBackgroundColorRatios": [
  0,
  0.9,
  1
 ],
 "titleFontWeight": "bold",
 "bodyBackgroundOpacity": 0,
 "minWidth": 20,
 "shadowVerticalLength": 0,
 "title": "AULA",
 "borderSize": 0,
 "height": 600,
 "headerPaddingLeft": 10,
 "titleFontStyle": "normal",
 "bodyBackgroundColor": [
  "#FFFFFF",
  "#DDDDDD",
  "#FFFFFF"
 ],
 "bodyPaddingLeft": 5,
 "contentOpaque": false,
 "footerHeight": 5,
 "headerPaddingRight": 10,
 "shadow": true,
 "hideEffect": {
  "class": "FadeOutEffect",
  "duration": 400,
  "easing": "cubic_in_out"
 },
 "scrollBarColor": "#000000",
 "backgroundColorDirection": "vertical",
 "veilShowEffect": {
  "class": "FadeInEffect",
  "duration": 400,
  "easing": "cubic_in_out"
 },
 "headerBackgroundColor": [
  "#DDDDDD",
  "#EEEEEE",
  "#FFFFFF"
 ],
 "closeButtonPaddingRight": 0,
 "bodyBorderColor": "#000000",
 "footerBorderColor": "#000000",
 "headerBackgroundOpacity": 1,
 "bodyBackgroundColorRatios": [
  0,
  0.5,
  1
 ],
 "closeButtonBackgroundColorRatios": [],
 "scrollBarOpacity": 0.5,
 "titleTextDecoration": "none",
 "closeButtonIconLineWidth": 2,
 "closeButtonPaddingLeft": 0,
 "bodyPaddingTop": 5,
 "children": [
  "this.htmlText_5F50674B_498E_C4B3_41BC_B9B0341B180E"
 ],
 "veilColor": [
  "#000000",
  "#000000"
 ],
 "shadowBlurRadius": 6,
 "scrollBarVisible": "rollOver",
 "shadowColor": "#000000",
 "headerPaddingTop": 10,
 "veilColorRatios": [
  0,
  1
 ],
 "closeButtonRollOverIconColor": "#FFFFFF",
 "closeButtonBorderSize": 0,
 "closeButtonBorderRadius": 11,
 "layout": "horizontal",
 "shadowOpacity": 0.5,
 "closeButtonBackgroundOpacity": 1,
 "bodyBackgroundColorDirection": "vertical",
 "borderRadius": 5,
 "closeButtonPaddingBottom": 0,
 "veilHideEffect": {
  "class": "FadeOutEffect",
  "duration": 400,
  "easing": "cubic_in_out"
 },
 "backgroundColorRatios": [],
 "headerPaddingBottom": 10,
 "titleFontSize": "6vh",
 "footerBackgroundOpacity": 0,
 "headerBackgroundColorRatios": [
  0,
  0.1,
  1
 ],
 "closeButtonPressedIconColor": "#FFFFFF",
 "closeButtonIconWidth": 12,
 "titlePaddingLeft": 5,
 "veilOpacity": 0,
 "closeButtonPressedBackgroundColor": [
  "#3A1D1F"
 ],
 "footerBorderSize": 0,
 "gap": 10,
 "paddingBottom": 0,
 "closeButtonIconColor": "#000000",
 "paddingTop": 0,
 "headerVerticalAlign": "middle",
 "bodyPaddingBottom": 5,
 "bodyPaddingRight": 5,
 "showEffect": {
  "class": "FadeInEffect",
  "duration": 400,
  "easing": "cubic_in_out"
 },
 "bodyBorderSize": 0,
 "shadowHorizontalLength": 3,
 "closeButtonPaddingTop": 0,
 "headerBackgroundColorDirection": "vertical",
 "data": {
  "name": "Window7611"
 },
 "titleFontFamily": "Arial",
 "closeButtonBackgroundColor": [],
 "paddingLeft": 0
},
{
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_21AC062D_2D1F_D73D_41A5_DB9BD2F0AB93_0/f/0/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_21AC062D_2D1F_D73D_41A5_DB9BD2F0AB93_0/f/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_21AC062D_2D1F_D73D_41A5_DB9BD2F0AB93_0/f/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_21AC062D_2D1F_D73D_41A5_DB9BD2F0AB93_0/u/0/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_21AC062D_2D1F_D73D_41A5_DB9BD2F0AB93_0/u/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_21AC062D_2D1F_D73D_41A5_DB9BD2F0AB93_0/u/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_21AC062D_2D1F_D73D_41A5_DB9BD2F0AB93_0/r/0/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_21AC062D_2D1F_D73D_41A5_DB9BD2F0AB93_0/r/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_21AC062D_2D1F_D73D_41A5_DB9BD2F0AB93_0/r/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_21AC062D_2D1F_D73D_41A5_DB9BD2F0AB93_0/b/0/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_21AC062D_2D1F_D73D_41A5_DB9BD2F0AB93_0/b/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_21AC062D_2D1F_D73D_41A5_DB9BD2F0AB93_0/b/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_21AC062D_2D1F_D73D_41A5_DB9BD2F0AB93_t.jpg",
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_21AC062D_2D1F_D73D_41A5_DB9BD2F0AB93_0/d/0/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_21AC062D_2D1F_D73D_41A5_DB9BD2F0AB93_0/d/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_21AC062D_2D1F_D73D_41A5_DB9BD2F0AB93_0/d/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_21AC062D_2D1F_D73D_41A5_DB9BD2F0AB93_0/l/0/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_21AC062D_2D1F_D73D_41A5_DB9BD2F0AB93_0/l/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_21AC062D_2D1F_D73D_41A5_DB9BD2F0AB93_0/l/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "label": "Penanaman",
 "hfovMin": "150%",
 "id": "panorama_21AC062D_2D1F_D73D_41A5_DB9BD2F0AB93",
 "class": "Panorama",
 "overlays": [
  "this.overlay_394B0266_2D00_EF2F_41A6_67E98B4104B4",
  "this.overlay_39F8FF81_2D00_55E9_41A7_94D752B9DBF4",
  "this.overlay_271F8D7D_3500_7214_41A3_2006477E7E72",
  "this.panorama_21AC062D_2D1F_D73D_41A5_DB9BD2F0AB93_tcap0",
  "this.panorama_21AC062D_2D1F_D73D_41A5_DB9BD2F0AB93_ccap0"
 ],
 "partial": false,
 "adjacentPanoramas": [
  {
   "backwardYaw": 154.66,
   "yaw": -16.56,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_25DD65E0_3303_F22C_41B8_CCEDFF035B4E"
  },
  {
   "backwardYaw": 23.1,
   "yaw": 37.92,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_24534248_3300_367C_4193_B77F834C5911"
  }
 ],
 "hfov": 360,
 "pitch": 0,
 "cardboardMenu": "this.Menu_450B479C_5371_F5DA_41C7_FAB497C358D4",
 "vfov": 180,
 "thumbnailUrl": "media/panorama_21AC062D_2D1F_D73D_41A5_DB9BD2F0AB93_t.jpg",
 "hfovMax": 130
},
{
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_21ADDE3C_2D1F_D722_41BE_FEAA4D868562_0/f/0/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_21ADDE3C_2D1F_D722_41BE_FEAA4D868562_0/f/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_21ADDE3C_2D1F_D722_41BE_FEAA4D868562_0/f/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_21ADDE3C_2D1F_D722_41BE_FEAA4D868562_0/u/0/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_21ADDE3C_2D1F_D722_41BE_FEAA4D868562_0/u/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_21ADDE3C_2D1F_D722_41BE_FEAA4D868562_0/u/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_21ADDE3C_2D1F_D722_41BE_FEAA4D868562_0/r/0/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_21ADDE3C_2D1F_D722_41BE_FEAA4D868562_0/r/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_21ADDE3C_2D1F_D722_41BE_FEAA4D868562_0/r/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_21ADDE3C_2D1F_D722_41BE_FEAA4D868562_0/b/0/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_21ADDE3C_2D1F_D722_41BE_FEAA4D868562_0/b/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_21ADDE3C_2D1F_D722_41BE_FEAA4D868562_0/b/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_21ADDE3C_2D1F_D722_41BE_FEAA4D868562_t.jpg",
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_21ADDE3C_2D1F_D722_41BE_FEAA4D868562_0/d/0/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_21ADDE3C_2D1F_D722_41BE_FEAA4D868562_0/d/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_21ADDE3C_2D1F_D722_41BE_FEAA4D868562_0/d/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_21ADDE3C_2D1F_D722_41BE_FEAA4D868562_0/l/0/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_21ADDE3C_2D1F_D722_41BE_FEAA4D868562_0/l/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_21ADDE3C_2D1F_D722_41BE_FEAA4D868562_0/l/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "label": "Pasar Balset 1",
 "hfovMin": "150%",
 "id": "panorama_21ADDE3C_2D1F_D722_41BE_FEAA4D868562",
 "class": "Panorama",
 "overlays": [
  "this.overlay_39C97D21_2D00_3525_41A4_DC45B062663D",
  "this.overlay_392378B4_2D00_FB23_41B6_2C7B31861EB5",
  "this.overlay_39D8143D_2D00_EB22_4196_13996269A211",
  "this.overlay_249FF9EB_3503_D23C_41B8_152DB2B67A74",
  "this.panorama_21ADDE3C_2D1F_D722_41BE_FEAA4D868562_tcap0",
  "this.panorama_21ADDE3C_2D1F_D722_41BE_FEAA4D868562_ccap0"
 ],
 "partial": false,
 "adjacentPanoramas": [
  {
   "backwardYaw": 6,
   "yaw": 143.1,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_25DD65E0_3303_F22C_41B8_CCEDFF035B4E"
  },
  {
   "backwardYaw": -12.77,
   "yaw": 19.17,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_21AC564D_2D1F_F762_41C4_CE95FB3A18CF"
  },
  {
   "backwardYaw": -12.77,
   "yaw": 19.17,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_21AC564D_2D1F_F762_41C4_CE95FB3A18CF"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_20049CCB_2D00_5B65_41B2_9F7305A7E252"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_20049CCB_2D00_5B65_41B2_9F7305A7E252"
  }
 ],
 "hfov": 360,
 "pitch": 0,
 "cardboardMenu": "this.Menu_450B479C_5371_F5DA_41C7_FAB497C358D4",
 "vfov": 180,
 "thumbnailUrl": "media/panorama_21ADDE3C_2D1F_D722_41BE_FEAA4D868562_t.jpg",
 "hfovMax": 130
},
{
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "targetYaw": -124.93,
    "class": "TargetPanoramaCameraMovement",
    "path": "shortest",
    "targetPitch": -0.79,
    "pitchSpeed": 17.05,
    "easing": "cubic_in_out",
    "yawSpeed": 33.25
   },
   {
    "targetYaw": 130.2,
    "class": "TargetPanoramaCameraMovement",
    "path": "shortest",
    "targetPitch": -2.29,
    "pitchSpeed": 17.05,
    "easing": "cubic_in_out",
    "yawSpeed": 33.25
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_21ADDE3C_2D1F_D722_41BE_FEAA4D868562_camera",
 "automaticZoomSpeed": 10
},
{
 "titleFontColor": "#000000",
 "shadowSpread": 1,
 "horizontalAlign": "center",
 "id": "window_42D7A8E4_5357_7B6A_41C1_8E86042FD3F1",
 "width": 400,
 "backgroundOpacity": 1,
 "closeButtonIconHeight": 12,
 "class": "Window",
 "overflow": "scroll",
 "footerBackgroundColorDirection": "vertical",
 "closeButtonRollOverBackgroundColor": [
  "#C13535"
 ],
 "titlePaddingRight": 5,
 "closeButtonRollOverBackgroundColorRatios": [
  0
 ],
 "titlePaddingTop": 5,
 "minHeight": 20,
 "veilColorDirection": "horizontal",
 "headerBorderSize": 0,
 "modal": true,
 "scrollBarWidth": 10,
 "scrollBarMargin": 2,
 "headerBorderColor": "#000000",
 "propagateClick": false,
 "verticalAlign": "middle",
 "footerBackgroundColor": [
  "#FFFFFF",
  "#EEEEEE",
  "#DDDDDD"
 ],
 "titlePaddingBottom": 5,
 "paddingRight": 0,
 "closeButtonPressedBackgroundColorRatios": [
  0
 ],
 "backgroundColor": [],
 "footerBackgroundColorRatios": [
  0,
  0.9,
  1
 ],
 "titleFontWeight": "bold",
 "bodyBackgroundOpacity": 1,
 "minWidth": 20,
 "shadowVerticalLength": 0,
 "title": "RUMAH PENGERINGAN",
 "borderSize": 0,
 "height": 600,
 "headerPaddingLeft": 10,
 "titleFontStyle": "normal",
 "bodyBackgroundColor": [
  "#FFFFFF",
  "#DDDDDD",
  "#FFFFFF"
 ],
 "bodyPaddingLeft": 5,
 "contentOpaque": false,
 "footerHeight": 5,
 "headerPaddingRight": 10,
 "shadow": true,
 "hideEffect": {
  "class": "FadeOutEffect",
  "duration": 500,
  "easing": "cubic_in_out"
 },
 "scrollBarColor": "#000000",
 "backgroundColorDirection": "vertical",
 "headerBackgroundOpacity": 1,
 "headerBackgroundColor": [
  "#DDDDDD",
  "#EEEEEE",
  "#FFFFFF"
 ],
 "bodyBorderColor": "#000000",
 "veilShowEffect": {
  "class": "FadeInEffect",
  "duration": 500,
  "easing": "cubic_in_out"
 },
 "bodyBackgroundColorRatios": [
  0,
  0.5,
  1
 ],
 "closeButtonBackgroundColorRatios": [],
 "scrollBarOpacity": 0.5,
 "titleTextDecoration": "none",
 "closeButtonIconLineWidth": 2,
 "bodyPaddingTop": 5,
 "children": [
  "this.htmlText_42D768E9_5357_7B7D_41D1_FA7F4E886E9A"
 ],
 "veilColor": [
  "#000000",
  "#000000"
 ],
 "shadowBlurRadius": 6,
 "scrollBarVisible": "rollOver",
 "shadowColor": "#000000",
 "headerPaddingTop": 10,
 "veilColorRatios": [
  0,
  1
 ],
 "closeButtonRollOverIconColor": "#FFFFFF",
 "closeButtonBorderRadius": 11,
 "layout": "vertical",
 "shadowOpacity": 0.5,
 "bodyBackgroundColorDirection": "vertical",
 "borderRadius": 5,
 "veilHideEffect": {
  "class": "FadeOutEffect",
  "duration": 500,
  "easing": "cubic_in_out"
 },
 "backgroundColorRatios": [],
 "headerPaddingBottom": 10,
 "titleFontSize": "1.29vmin",
 "headerBackgroundColorRatios": [
  0,
  0.1,
  1
 ],
 "closeButtonPressedIconColor": "#FFFFFF",
 "closeButtonIconWidth": 12,
 "titlePaddingLeft": 5,
 "veilOpacity": 0.4,
 "closeButtonPressedBackgroundColor": [
  "#3A1D1F"
 ],
 "gap": 10,
 "paddingBottom": 0,
 "closeButtonIconColor": "#000000",
 "paddingTop": 0,
 "headerVerticalAlign": "middle",
 "bodyPaddingBottom": 5,
 "bodyPaddingRight": 5,
 "showEffect": {
  "class": "FadeInEffect",
  "duration": 500,
  "easing": "cubic_in_out"
 },
 "bodyBorderSize": 0,
 "shadowHorizontalLength": 3,
 "headerBackgroundColorDirection": "vertical",
 "data": {
  "name": "Window3687"
 },
 "titleFontFamily": "Arial",
 "closeButtonBackgroundColor": [],
 "paddingLeft": 0
},
{
 "viewerArea": "this.MapViewer",
 "id": "MapViewerMapPlayer",
 "movementMode": "constrained",
 "class": "MapPlayer"
},
{
 "initialPosition": {
  "yaw": 117.29,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "targetYaw": 0,
    "class": "TargetPanoramaCameraMovement",
    "path": "shortest",
    "targetPitch": 0,
    "pitchSpeed": 16.54,
    "easing": "cubic_in_out",
    "yawSpeed": 32.22
   },
   {
    "targetYaw": -120.98,
    "class": "TargetPanoramaCameraMovement",
    "path": "shortest",
    "targetPitch": -6.54,
    "pitchSpeed": 17.05,
    "easing": "cubic_in_out",
    "yawSpeed": 33.25
   },
   {
    "targetYaw": 148.36,
    "class": "TargetPanoramaCameraMovement",
    "path": "shortest",
    "targetPitch": -24.4,
    "pitchSpeed": 17.05,
    "easing": "cubic_in_out",
    "yawSpeed": 33.25
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_446F089B_5371_FBDE_41B7_5DBA6D6E56C7",
 "automaticZoomSpeed": 10
},
{
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_21AC564D_2D1F_F762_41C4_CE95FB3A18CF_0/f/0/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_21AC564D_2D1F_F762_41C4_CE95FB3A18CF_0/f/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_21AC564D_2D1F_F762_41C4_CE95FB3A18CF_0/f/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_21AC564D_2D1F_F762_41C4_CE95FB3A18CF_0/u/0/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_21AC564D_2D1F_F762_41C4_CE95FB3A18CF_0/u/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_21AC564D_2D1F_F762_41C4_CE95FB3A18CF_0/u/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_21AC564D_2D1F_F762_41C4_CE95FB3A18CF_0/r/0/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_21AC564D_2D1F_F762_41C4_CE95FB3A18CF_0/r/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_21AC564D_2D1F_F762_41C4_CE95FB3A18CF_0/r/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_21AC564D_2D1F_F762_41C4_CE95FB3A18CF_0/b/0/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_21AC564D_2D1F_F762_41C4_CE95FB3A18CF_0/b/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_21AC564D_2D1F_F762_41C4_CE95FB3A18CF_0/b/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_21AC564D_2D1F_F762_41C4_CE95FB3A18CF_t.jpg",
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_21AC564D_2D1F_F762_41C4_CE95FB3A18CF_0/d/0/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_21AC564D_2D1F_F762_41C4_CE95FB3A18CF_0/d/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_21AC564D_2D1F_F762_41C4_CE95FB3A18CF_0/d/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_21AC564D_2D1F_F762_41C4_CE95FB3A18CF_0/l/0/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_21AC564D_2D1F_F762_41C4_CE95FB3A18CF_0/l/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_21AC564D_2D1F_F762_41C4_CE95FB3A18CF_0/l/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "label": "Pasar Balset 2",
 "hfovMin": "150%",
 "id": "panorama_21AC564D_2D1F_F762_41C4_CE95FB3A18CF",
 "class": "Panorama",
 "overlays": [
  "this.overlay_38FA5FF9_2D03_D522_41B7_EE567F5DC5E8",
  "this.overlay_24AE8CCC_3500_3274_41B6_3D39286DC236",
  "this.panorama_21AC564D_2D1F_F762_41C4_CE95FB3A18CF_tcap0",
  "this.panorama_21AC564D_2D1F_F762_41C4_CE95FB3A18CF_ccap0"
 ],
 "partial": false,
 "adjacentPanoramas": [
  {
   "backwardYaw": 19.17,
   "yaw": -12.77,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_21ADDE3C_2D1F_D722_41BE_FEAA4D868562"
  }
 ],
 "hfov": 360,
 "pitch": 0,
 "cardboardMenu": "this.Menu_450B479C_5371_F5DA_41C7_FAB497C358D4",
 "vfov": 180,
 "thumbnailUrl": "media/panorama_21AC564D_2D1F_F762_41C4_CE95FB3A18CF_t.jpg",
 "hfovMax": 130
},
{
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "targetYaw": -120.98,
    "class": "TargetPanoramaCameraMovement",
    "path": "shortest",
    "targetPitch": -6.54,
    "pitchSpeed": 17.05,
    "easing": "cubic_in_out",
    "yawSpeed": 33.25
   },
   {
    "targetYaw": 148.36,
    "class": "TargetPanoramaCameraMovement",
    "path": "shortest",
    "targetPitch": -24.4,
    "pitchSpeed": 17.05,
    "easing": "cubic_in_out",
    "yawSpeed": 33.25
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_2183758B_2D00_35E6_41AB_8B264F8B31F8_camera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": 167.23,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "targetYaw": 0,
    "class": "TargetPanoramaCameraMovement",
    "path": "shortest",
    "targetPitch": 0,
    "pitchSpeed": 19.44,
    "easing": "cubic_in_out",
    "yawSpeed": 38.05
   },
   {
    "targetYaw": -145.5,
    "class": "TargetPanoramaCameraMovement",
    "path": "shortest",
    "targetPitch": 4.36,
    "pitchSpeed": 17.05,
    "easing": "cubic_in_out",
    "yawSpeed": 33.25
   },
   {
    "targetYaw": 120.82,
    "class": "TargetPanoramaCameraMovement",
    "path": "shortest",
    "targetPitch": -9.87,
    "pitchSpeed": 17.05,
    "easing": "cubic_in_out",
    "yawSpeed": 33.25
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_44C308F8_5371_FB5A_41C2_3D96CECEACB5",
 "automaticZoomSpeed": 10
},
{
 "titleFontColor": "#000000",
 "shadowSpread": 1,
 "horizontalAlign": "center",
 "id": "window_41DA232A_5351_8EFE_41A2_9410326121A9",
 "width": 400,
 "backgroundOpacity": 1,
 "closeButtonIconHeight": 12,
 "class": "Window",
 "overflow": "scroll",
 "footerBackgroundColorDirection": "vertical",
 "closeButtonRollOverBackgroundColor": [
  "#C13535"
 ],
 "titlePaddingRight": 5,
 "closeButtonRollOverBackgroundColorRatios": [
  0
 ],
 "titlePaddingTop": 5,
 "minHeight": 20,
 "veilColorDirection": "horizontal",
 "headerBorderSize": 0,
 "modal": true,
 "scrollBarWidth": 10,
 "scrollBarMargin": 2,
 "headerBorderColor": "#000000",
 "propagateClick": false,
 "verticalAlign": "middle",
 "footerBackgroundColor": [
  "#FFFFFF",
  "#EEEEEE",
  "#DDDDDD"
 ],
 "titlePaddingBottom": 5,
 "paddingRight": 0,
 "closeButtonPressedBackgroundColorRatios": [
  0
 ],
 "backgroundColor": [],
 "footerBackgroundColorRatios": [
  0,
  0.9,
  1
 ],
 "titleFontWeight": "normal",
 "bodyBackgroundOpacity": 1,
 "minWidth": 20,
 "shadowVerticalLength": 0,
 "title": "PETERNAKAN",
 "borderSize": 0,
 "height": 600,
 "headerPaddingLeft": 10,
 "titleFontStyle": "normal",
 "bodyBackgroundColor": [
  "#FFFFFF",
  "#DDDDDD",
  "#FFFFFF"
 ],
 "bodyPaddingLeft": 5,
 "contentOpaque": false,
 "footerHeight": 5,
 "headerPaddingRight": 10,
 "shadow": true,
 "hideEffect": {
  "class": "FadeOutEffect",
  "duration": 500,
  "easing": "cubic_in_out"
 },
 "scrollBarColor": "#000000",
 "backgroundColorDirection": "vertical",
 "headerBackgroundOpacity": 1,
 "headerBackgroundColor": [
  "#DDDDDD",
  "#EEEEEE",
  "#FFFFFF"
 ],
 "bodyBorderColor": "#000000",
 "veilShowEffect": {
  "class": "FadeInEffect",
  "duration": 500,
  "easing": "cubic_in_out"
 },
 "bodyBackgroundColorRatios": [
  0,
  0.5,
  1
 ],
 "closeButtonBackgroundColorRatios": [],
 "scrollBarOpacity": 0.5,
 "titleTextDecoration": "none",
 "closeButtonIconLineWidth": 2,
 "bodyPaddingTop": 5,
 "children": [
  "this.htmlText_41D8132A_5351_8EFE_41A5_D22980DFE60A"
 ],
 "veilColor": [
  "#000000",
  "#000000"
 ],
 "shadowBlurRadius": 6,
 "scrollBarVisible": "rollOver",
 "shadowColor": "#000000",
 "headerPaddingTop": 10,
 "veilColorRatios": [
  0,
  1
 ],
 "closeButtonRollOverIconColor": "#FFFFFF",
 "closeButtonBorderRadius": 11,
 "layout": "vertical",
 "shadowOpacity": 0.5,
 "bodyBackgroundColorDirection": "vertical",
 "borderRadius": 5,
 "veilHideEffect": {
  "class": "FadeOutEffect",
  "duration": 500,
  "easing": "cubic_in_out"
 },
 "backgroundColorRatios": [],
 "headerPaddingBottom": 10,
 "titleFontSize": "2vmin",
 "headerBackgroundColorRatios": [
  0,
  0.1,
  1
 ],
 "closeButtonPressedIconColor": "#FFFFFF",
 "closeButtonIconWidth": 12,
 "titlePaddingLeft": 5,
 "veilOpacity": 0.4,
 "closeButtonPressedBackgroundColor": [
  "#3A1D1F"
 ],
 "gap": 10,
 "paddingBottom": 0,
 "closeButtonIconColor": "#000000",
 "paddingTop": 0,
 "headerVerticalAlign": "middle",
 "bodyPaddingBottom": 5,
 "bodyPaddingRight": 5,
 "showEffect": {
  "class": "FadeInEffect",
  "duration": 500,
  "easing": "cubic_in_out"
 },
 "bodyBorderSize": 0,
 "shadowHorizontalLength": 3,
 "headerBackgroundColorDirection": "vertical",
 "data": {
  "name": "Window4485"
 },
 "titleFontFamily": "Arial",
 "closeButtonBackgroundColor": [],
 "paddingLeft": 0
},
{
 "initialPosition": {
  "yaw": 109.89,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "targetYaw": 65.94,
    "class": "TargetPanoramaCameraMovement",
    "path": "shortest",
    "targetPitch": -6.7,
    "pitchSpeed": 11.84,
    "easing": "cubic_in_out",
    "yawSpeed": 22.79
   },
   {
    "targetYaw": 131.74,
    "class": "TargetPanoramaCameraMovement",
    "path": "shortest",
    "targetPitch": -5.61,
    "pitchSpeed": 17.05,
    "easing": "cubic_in_out",
    "yawSpeed": 33.25
   },
   {
    "targetYaw": -96.17,
    "class": "TargetPanoramaCameraMovement",
    "path": "shortest",
    "targetPitch": 0.11,
    "pitchSpeed": 17.05,
    "easing": "cubic_in_out",
    "yawSpeed": 33.25
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_470DE97C_5371_FD5B_41CD_0099770CD3C2",
 "automaticZoomSpeed": 10
},
{
 "fontColor": "#FFFFFF",
 "fontFamily": "Arial",
 "rollOverBackgroundColor": "#000000",
 "children": [
  {
   "label": "Aula",
   "click": "this.mainPlayList.set('selectedIndex', 0)",
   "class": "MenuItem"
  },
  {
   "label": "Mushola & Toilet",
   "click": "this.mainPlayList.set('selectedIndex', 1)",
   "class": "MenuItem"
  },
  {
   "label": "Pengeringan",
   "click": "this.mainPlayList.set('selectedIndex', 2)",
   "class": "MenuItem"
  },
  {
   "label": "Penanaman",
   "click": "this.mainPlayList.set('selectedIndex', 3)",
   "class": "MenuItem"
  },
  {
   "label": "Pasar Balset 1",
   "click": "this.mainPlayList.set('selectedIndex', 4)",
   "class": "MenuItem"
  },
  {
   "label": "Pasar Balset 2",
   "click": "this.mainPlayList.set('selectedIndex', 5)",
   "class": "MenuItem"
  },
  {
   "label": "Peternakan",
   "click": "this.mainPlayList.set('selectedIndex', 6)",
   "class": "MenuItem"
  },
  {
   "label": "Penginapan Tamu",
   "click": "this.mainPlayList.set('selectedIndex', 7)",
   "class": "MenuItem"
  }
 ],
 "label": "Media",
 "id": "Menu_450B479C_5371_F5DA_41C7_FAB497C358D4",
 "opacity": 0.4,
 "class": "Menu",
 "selectedFontColor": "#FFFFFF",
 "rollOverOpacity": 0.8,
 "selectedBackgroundColor": "#202020",
 "backgroundColor": "#404040",
 "rollOverFontColor": "#FFFFFF"
},
{
 "initialPosition": {
  "yaw": 104.38,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "targetYaw": 0,
    "class": "TargetPanoramaCameraMovement",
    "path": "shortest",
    "targetPitch": 0,
    "pitchSpeed": 12.68,
    "easing": "cubic_in_out",
    "yawSpeed": 24.47
   },
   {
    "targetYaw": -143.39,
    "class": "TargetPanoramaCameraMovement",
    "path": "shortest",
    "targetPitch": -3.52,
    "pitchSpeed": 17.05,
    "easing": "cubic_in_out",
    "yawSpeed": 33.25
   },
   {
    "targetYaw": -61.38,
    "class": "TargetPanoramaCameraMovement",
    "path": "shortest",
    "targetPitch": -1.09,
    "pitchSpeed": 17.05,
    "easing": "cubic_in_out",
    "yawSpeed": 33.25
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_45CA282B_5371_FAFD_41CB_A12A6D5B6B17",
 "automaticZoomSpeed": 10
},
{
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_2183758B_2D00_35E6_41AB_8B264F8B31F8_0/f/0/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_2183758B_2D00_35E6_41AB_8B264F8B31F8_0/f/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_2183758B_2D00_35E6_41AB_8B264F8B31F8_0/f/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_2183758B_2D00_35E6_41AB_8B264F8B31F8_0/u/0/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_2183758B_2D00_35E6_41AB_8B264F8B31F8_0/u/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_2183758B_2D00_35E6_41AB_8B264F8B31F8_0/u/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_2183758B_2D00_35E6_41AB_8B264F8B31F8_0/r/0/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_2183758B_2D00_35E6_41AB_8B264F8B31F8_0/r/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_2183758B_2D00_35E6_41AB_8B264F8B31F8_0/r/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_2183758B_2D00_35E6_41AB_8B264F8B31F8_0/b/0/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_2183758B_2D00_35E6_41AB_8B264F8B31F8_0/b/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_2183758B_2D00_35E6_41AB_8B264F8B31F8_0/b/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_2183758B_2D00_35E6_41AB_8B264F8B31F8_t.jpg",
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_2183758B_2D00_35E6_41AB_8B264F8B31F8_0/d/0/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_2183758B_2D00_35E6_41AB_8B264F8B31F8_0/d/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_2183758B_2D00_35E6_41AB_8B264F8B31F8_0/d/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_2183758B_2D00_35E6_41AB_8B264F8B31F8_0/l/0/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_2183758B_2D00_35E6_41AB_8B264F8B31F8_0/l/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_2183758B_2D00_35E6_41AB_8B264F8B31F8_0/l/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "label": "Mushola & Toilet",
 "hfovMin": "150%",
 "id": "panorama_2183758B_2D00_35E6_41AB_8B264F8B31F8",
 "class": "Panorama",
 "overlays": [
  "this.overlay_38147F55_2D00_556D_41C4_395B143BC60E",
  "this.overlay_25FB1817_3500_3214_41C4_DF102A80DFD0",
  "this.overlay_249EDD74_3500_D214_41B5_7A9ADF00024B",
  "this.panorama_2183758B_2D00_35E6_41AB_8B264F8B31F8_tcap0",
  "this.panorama_2183758B_2D00_35E6_41AB_8B264F8B31F8_ccap0"
 ],
 "partial": false,
 "adjacentPanoramas": [
  {
   "backwardYaw": -131.27,
   "yaw": -62.71,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_20049CCB_2D00_5B65_41B2_9F7305A7E252"
  }
 ],
 "hfov": 360,
 "pitch": 0,
 "cardboardMenu": "this.Menu_450B479C_5371_F5DA_41C7_FAB497C358D4",
 "vfov": 180,
 "thumbnailUrl": "media/panorama_2183758B_2D00_35E6_41AB_8B264F8B31F8_t.jpg",
 "hfovMax": 130
},
{
 "initialPosition": {
  "yaw": -25.34,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "targetYaw": 0,
    "class": "TargetPanoramaCameraMovement",
    "path": "shortest",
    "targetPitch": 0,
    "pitchSpeed": 6.15,
    "easing": "cubic_in_out",
    "yawSpeed": 11.35
   },
   {
    "targetYaw": 78.76,
    "class": "TargetPanoramaCameraMovement",
    "path": "shortest",
    "targetPitch": -5.63,
    "pitchSpeed": 17.05,
    "easing": "cubic_in_out",
    "yawSpeed": 33.25
   },
   {
    "targetYaw": 170.47,
    "class": "TargetPanoramaCameraMovement",
    "path": "shortest",
    "targetPitch": -5.33,
    "pitchSpeed": 17.05,
    "easing": "cubic_in_out",
    "yawSpeed": 33.25
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_45B44877_5371_FB56_41C6_B8A36E4AA649",
 "automaticZoomSpeed": 10
},
{
 "autoplay": true,
 "audio": {
  "class": "AudioResource",
  "oggUrl": "media/audio_53B75033_4983_FCD3_41D2_0BFD85104AAF.ogg",
  "mp3Url": "media/audio_53B75033_4983_FCD3_41D2_0BFD85104AAF.mp3"
 },
 "class": "MediaAudio",
 "id": "audio_53B75033_4983_FCD3_41D2_0BFD85104AAF",
 "data": {
  "label": "BC - Copy"
 }
},
{
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "targetYaw": -140.37,
    "class": "TargetPanoramaCameraMovement",
    "path": "shortest",
    "targetPitch": -3.52,
    "pitchSpeed": 17.05,
    "easing": "cubic_in_out",
    "yawSpeed": 33.25
   },
   {
    "targetYaw": 127.79,
    "class": "TargetPanoramaCameraMovement",
    "path": "shortest",
    "targetPitch": 2.54,
    "pitchSpeed": 17.05,
    "easing": "cubic_in_out",
    "yawSpeed": 33.25
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_24534248_3300_367C_4193_B77F834C5911_camera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "targetYaw": -145.5,
    "class": "TargetPanoramaCameraMovement",
    "path": "shortest",
    "targetPitch": 4.36,
    "pitchSpeed": 17.05,
    "easing": "cubic_in_out",
    "yawSpeed": 33.25
   },
   {
    "targetYaw": 120.82,
    "class": "TargetPanoramaCameraMovement",
    "path": "shortest",
    "targetPitch": -9.87,
    "pitchSpeed": 17.05,
    "easing": "cubic_in_out",
    "yawSpeed": 33.25
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_21AC564D_2D1F_F762_41C4_CE95FB3A18CF_camera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": 65.94,
  "class": "PanoramaCameraPosition",
  "pitch": -6.7
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "targetYaw": 131.74,
    "class": "TargetPanoramaCameraMovement",
    "path": "shortest",
    "targetPitch": -5.61,
    "pitchSpeed": 17.05,
    "easing": "cubic_in_out",
    "yawSpeed": 33.25
   },
   {
    "targetYaw": -96.17,
    "class": "TargetPanoramaCameraMovement",
    "path": "shortest",
    "targetPitch": 0.11,
    "pitchSpeed": 17.05,
    "easing": "cubic_in_out",
    "yawSpeed": 33.25
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_21AC5DF8_2D00_3522_4192_F1EC0575A351_camera",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": -95.29,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "targetYaw": 0,
    "class": "TargetPanoramaCameraMovement",
    "path": "shortest",
    "targetPitch": 0,
    "pitchSpeed": 11.89,
    "easing": "cubic_in_out",
    "yawSpeed": 22.89
   },
   {
    "targetYaw": -140.37,
    "class": "TargetPanoramaCameraMovement",
    "path": "shortest",
    "targetPitch": -3.52,
    "pitchSpeed": 17.05,
    "easing": "cubic_in_out",
    "yawSpeed": 33.25
   },
   {
    "targetYaw": 127.79,
    "class": "TargetPanoramaCameraMovement",
    "path": "shortest",
    "targetPitch": 2.54,
    "pitchSpeed": 17.05,
    "easing": "cubic_in_out",
    "yawSpeed": 33.25
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_45A2E859_5371_FB5A_41C0_5FBFBDEDBBB9",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": -156.9,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "targetYaw": 0,
    "class": "TargetPanoramaCameraMovement",
    "path": "shortest",
    "targetPitch": 0,
    "pitchSpeed": 18.94,
    "easing": "cubic_in_out",
    "yawSpeed": 37.04
   },
   {
    "targetYaw": -140.37,
    "class": "TargetPanoramaCameraMovement",
    "path": "shortest",
    "targetPitch": -3.52,
    "pitchSpeed": 17.05,
    "easing": "cubic_in_out",
    "yawSpeed": 33.25
   },
   {
    "targetYaw": 127.79,
    "class": "TargetPanoramaCameraMovement",
    "path": "shortest",
    "targetPitch": 2.54,
    "pitchSpeed": 17.05,
    "easing": "cubic_in_out",
    "yawSpeed": 33.25
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_458DC889_5371_FBBA_41BA_816325809788",
 "automaticZoomSpeed": 10
},
{
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_24534248_3300_367C_4193_B77F834C5911_0/f/0/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_24534248_3300_367C_4193_B77F834C5911_0/f/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_24534248_3300_367C_4193_B77F834C5911_0/f/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_24534248_3300_367C_4193_B77F834C5911_0/u/0/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_24534248_3300_367C_4193_B77F834C5911_0/u/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_24534248_3300_367C_4193_B77F834C5911_0/u/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_24534248_3300_367C_4193_B77F834C5911_0/r/0/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_24534248_3300_367C_4193_B77F834C5911_0/r/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_24534248_3300_367C_4193_B77F834C5911_0/r/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_24534248_3300_367C_4193_B77F834C5911_0/b/0/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_24534248_3300_367C_4193_B77F834C5911_0/b/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_24534248_3300_367C_4193_B77F834C5911_0/b/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_24534248_3300_367C_4193_B77F834C5911_t.jpg",
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_24534248_3300_367C_4193_B77F834C5911_0/d/0/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_24534248_3300_367C_4193_B77F834C5911_0/d/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_24534248_3300_367C_4193_B77F834C5911_0/d/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_24534248_3300_367C_4193_B77F834C5911_0/l/0/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_24534248_3300_367C_4193_B77F834C5911_0/l/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_24534248_3300_367C_4193_B77F834C5911_0/l/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "label": "Peternakan",
 "hfovMin": "150%",
 "id": "panorama_24534248_3300_367C_4193_B77F834C5911",
 "class": "Panorama",
 "overlays": [
  "this.overlay_242DE2FB_3300_361C_41C5_0F8AA9AD66C7",
  "this.overlay_2419A189_3300_F2FC_41A1_CB04BDEDD2A7",
  "this.overlay_275DAD42_3500_526C_419E_57B09511DE79",
  "this.panorama_24534248_3300_367C_4193_B77F834C5911_tcap0",
  "this.panorama_24534248_3300_367C_4193_B77F834C5911_ccap0"
 ],
 "partial": false,
 "adjacentPanoramas": [
  {
   "backwardYaw": 37.92,
   "yaw": 23.1,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_21AC062D_2D1F_D73D_41A5_DB9BD2F0AB93"
  },
  {
   "backwardYaw": -70.11,
   "yaw": 84.71,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_21AC5DF8_2D00_3522_4192_F1EC0575A351"
  }
 ],
 "hfov": 360,
 "pitch": 0,
 "cardboardMenu": "this.Menu_450B479C_5371_F5DA_41C7_FAB497C358D4",
 "vfov": 180,
 "thumbnailUrl": "media/panorama_24534248_3300_367C_4193_B77F834C5911_t.jpg",
 "hfovMax": 130
},
{
 "initialPosition": {
  "yaw": 48.73,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "targetYaw": 0,
    "class": "TargetPanoramaCameraMovement",
    "path": "shortest",
    "targetPitch": 0,
    "pitchSpeed": 6.45,
    "easing": "cubic_in_out",
    "yawSpeed": 11.96
   },
   {
    "targetYaw": -143.39,
    "class": "TargetPanoramaCameraMovement",
    "path": "shortest",
    "targetPitch": -3.52,
    "pitchSpeed": 17.05,
    "easing": "cubic_in_out",
    "yawSpeed": 33.25
   },
   {
    "targetYaw": -61.38,
    "class": "TargetPanoramaCameraMovement",
    "path": "shortest",
    "targetPitch": -1.09,
    "pitchSpeed": 17.05,
    "easing": "cubic_in_out",
    "yawSpeed": 33.25
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_442A38C2_5371_FBAE_41A5_B397B8A11EFC",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": 163.44,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "targetYaw": 0,
    "class": "TargetPanoramaCameraMovement",
    "path": "shortest",
    "targetPitch": 0,
    "pitchSpeed": 26.61,
    "easing": "cubic_in_out",
    "yawSpeed": 52.46
   },
   {
    "targetYaw": 102.37,
    "class": "TargetPanoramaCameraMovement",
    "path": "shortest",
    "targetPitch": 3.45,
    "pitchSpeed": 17.05,
    "easing": "cubic_in_out",
    "yawSpeed": 33.25
   },
   {
    "targetYaw": -104.64,
    "class": "TargetPanoramaCameraMovement",
    "path": "shortest",
    "targetPitch": 1.34,
    "pitchSpeed": 17.05,
    "easing": "cubic_in_out",
    "yawSpeed": 33.25
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_451C77D6_5371_F556_41B6_F7B3F46F2290",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": -36.9,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "targetYaw": 0,
    "class": "TargetPanoramaCameraMovement",
    "path": "shortest",
    "targetPitch": 0,
    "pitchSpeed": 5.74,
    "easing": "cubic_in_out",
    "yawSpeed": 10.52
   },
   {
    "targetYaw": -124.93,
    "class": "TargetPanoramaCameraMovement",
    "path": "shortest",
    "targetPitch": -0.79,
    "pitchSpeed": 17.05,
    "easing": "cubic_in_out",
    "yawSpeed": 33.25
   },
   {
    "targetYaw": 130.2,
    "class": "TargetPanoramaCameraMovement",
    "path": "shortest",
    "targetPitch": -2.29,
    "pitchSpeed": 17.05,
    "easing": "cubic_in_out",
    "yawSpeed": 33.25
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_45F237FE_5371_F556_41B4_A9831EB97CBE",
 "automaticZoomSpeed": 10
},
{
 "fieldOfViewOverlayInsideColor": "#FFFFFF",
 "fieldOfViewOverlayInsideOpacity": 0.4,
 "thumbnailUrl": "media/map_3D35B000_2D00_6AE3_41B3_814517E43860_t.jpg",
 "fieldOfViewOverlayRadiusScale": 0.3,
 "fieldOfViewOverlayOutsideOpacity": 0,
 "fieldOfViewOverlayOutsideColor": "#000000",
 "width": 5120,
 "initialZoomFactor": 1,
 "id": "map_3D35B000_2D00_6AE3_41B3_814517E43860",
 "class": "Map",
 "maximumZoomFactor": 1.2,
 "minimumZoomFactor": 0.5,
 "label": "PANO_20260114_073204_0",
 "image": {
  "levels": [
   {
    "url": "media/map_3D35B000_2D00_6AE3_41B3_814517E43860.jpeg",
    "width": 3200,
    "class": "ImageResourceLevel",
    "height": 843
   },
   {
    "url": "media/map_3D35B000_2D00_6AE3_41B3_814517E43860_lq.jpeg",
    "width": 498,
    "tags": "preload",
    "class": "ImageResourceLevel",
    "height": 132
   }
  ],
  "class": "ImageResource"
 },
 "scaleMode": "fit_inside",
 "height": 1350
},
{
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_25DD65E0_3303_F22C_41B8_CCEDFF035B4E_0/f/0/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_25DD65E0_3303_F22C_41B8_CCEDFF035B4E_0/f/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_25DD65E0_3303_F22C_41B8_CCEDFF035B4E_0/f/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_25DD65E0_3303_F22C_41B8_CCEDFF035B4E_0/u/0/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_25DD65E0_3303_F22C_41B8_CCEDFF035B4E_0/u/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_25DD65E0_3303_F22C_41B8_CCEDFF035B4E_0/u/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_25DD65E0_3303_F22C_41B8_CCEDFF035B4E_0/r/0/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_25DD65E0_3303_F22C_41B8_CCEDFF035B4E_0/r/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_25DD65E0_3303_F22C_41B8_CCEDFF035B4E_0/r/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_25DD65E0_3303_F22C_41B8_CCEDFF035B4E_0/b/0/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_25DD65E0_3303_F22C_41B8_CCEDFF035B4E_0/b/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_25DD65E0_3303_F22C_41B8_CCEDFF035B4E_0/b/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_25DD65E0_3303_F22C_41B8_CCEDFF035B4E_t.jpg",
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_25DD65E0_3303_F22C_41B8_CCEDFF035B4E_0/d/0/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_25DD65E0_3303_F22C_41B8_CCEDFF035B4E_0/d/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_25DD65E0_3303_F22C_41B8_CCEDFF035B4E_0/d/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_25DD65E0_3303_F22C_41B8_CCEDFF035B4E_0/l/0/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_25DD65E0_3303_F22C_41B8_CCEDFF035B4E_0/l/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_25DD65E0_3303_F22C_41B8_CCEDFF035B4E_0/l/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame"
  }
 ],
 "label": "Penginapan Tamu",
 "hfovMin": "150%",
 "id": "panorama_25DD65E0_3303_F22C_41B8_CCEDFF035B4E",
 "class": "Panorama",
 "overlays": [
  "this.overlay_25F3714E_3300_3274_41B4_AFB06C588D63",
  "this.overlay_2440C4A3_3300_722C_41B7_CC90052F1F71",
  "this.overlay_2771C0CC_3500_7274_41B4_AF17AFD35688",
  "this.panorama_25DD65E0_3303_F22C_41B8_CCEDFF035B4E_tcap0",
  "this.panorama_25DD65E0_3303_F22C_41B8_CCEDFF035B4E_ccap0"
 ],
 "partial": false,
 "adjacentPanoramas": [
  {
   "backwardYaw": -16.56,
   "yaw": 154.66,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_21AC062D_2D1F_D73D_41A5_DB9BD2F0AB93"
  },
  {
   "backwardYaw": 143.1,
   "yaw": 6,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_21ADDE3C_2D1F_D722_41BE_FEAA4D868562"
  }
 ],
 "hfov": 360,
 "pitch": 0,
 "cardboardMenu": "this.Menu_450B479C_5371_F5DA_41C7_FAB497C358D4",
 "vfov": 180,
 "thumbnailUrl": "media/panorama_25DD65E0_3303_F22C_41B8_CCEDFF035B4E_t.jpg",
 "hfovMax": 130
},
{
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_20049CCB_2D00_5B65_41B2_9F7305A7E252_0/f/0/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_20049CCB_2D00_5B65_41B2_9F7305A7E252_0/f/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_20049CCB_2D00_5B65_41B2_9F7305A7E252_0/f/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_20049CCB_2D00_5B65_41B2_9F7305A7E252_0/u/0/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_20049CCB_2D00_5B65_41B2_9F7305A7E252_0/u/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_20049CCB_2D00_5B65_41B2_9F7305A7E252_0/u/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_20049CCB_2D00_5B65_41B2_9F7305A7E252_0/b/0/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_20049CCB_2D00_5B65_41B2_9F7305A7E252_0/b/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_20049CCB_2D00_5B65_41B2_9F7305A7E252_0/b/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_20049CCB_2D00_5B65_41B2_9F7305A7E252_t.jpg",
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_20049CCB_2D00_5B65_41B2_9F7305A7E252_0/d/0/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_20049CCB_2D00_5B65_41B2_9F7305A7E252_0/d/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_20049CCB_2D00_5B65_41B2_9F7305A7E252_0/d/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_20049CCB_2D00_5B65_41B2_9F7305A7E252_0/l/0/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_20049CCB_2D00_5B65_41B2_9F7305A7E252_0/l/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_20049CCB_2D00_5B65_41B2_9F7305A7E252_0/l/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "right": {
    "levels": [
     {
      "url": "media/panorama_20049CCB_2D00_5B65_41B2_9F7305A7E252_0/r/0/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_20049CCB_2D00_5B65_41B2_9F7305A7E252_0/r/1/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_20049CCB_2D00_5B65_41B2_9F7305A7E252_0/r/2/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "label": "Aula",
 "hfovMin": "111%",
 "id": "panorama_20049CCB_2D00_5B65_41B2_9F7305A7E252",
 "class": "Panorama",
 "overlays": [
  "this.overlay_3EBE8D20_2D0F_F523_41C1_1AF313362BCF",
  "this.overlay_388F13AC_2D00_6D23_41AB_C1301BA30D36",
  "this.overlay_3ED44140_2D03_ED62_41C2_AD468C6CAE70",
  "this.panorama_20049CCB_2D00_5B65_41B2_9F7305A7E252_tcap0",
  "this.panorama_20049CCB_2D00_5B65_41B2_9F7305A7E252_ccap0"
 ],
 "partial": false,
 "adjacentPanoramas": [
  {
   "backwardYaw": -62.71,
   "yaw": -131.27,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_2183758B_2D00_35E6_41AB_8B264F8B31F8"
  },
  {
   "backwardYaw": -18.16,
   "yaw": -75.62,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_21AC5DF8_2D00_3522_4192_F1EC0575A351"
  }
 ],
 "hfov": 360,
 "pitch": 0,
 "cardboardMenu": "this.Menu_450B479C_5371_F5DA_41C7_FAB497C358D4",
 "vfov": 180,
 "thumbnailUrl": "media/panorama_20049CCB_2D00_5B65_41B2_9F7305A7E252_t.jpg",
 "hfovMax": 130
},
{
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "targetYaw": 78.76,
    "class": "TargetPanoramaCameraMovement",
    "path": "shortest",
    "targetPitch": -5.63,
    "pitchSpeed": 17.05,
    "easing": "cubic_in_out",
    "yawSpeed": 33.25
   },
   {
    "targetYaw": 170.47,
    "class": "TargetPanoramaCameraMovement",
    "path": "shortest",
    "targetPitch": -5.33,
    "pitchSpeed": 17.05,
    "easing": "cubic_in_out",
    "yawSpeed": 33.25
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_25DD65E0_3303_F22C_41B8_CCEDFF035B4E_camera",
 "automaticZoomSpeed": 10
},
{
 "titleFontColor": "#000000",
 "shadowSpread": 1,
 "horizontalAlign": "center",
 "id": "window_5DCEB4A5_4FF8_F4EE_41C8_6FB959689EB2",
 "width": 400,
 "backgroundOpacity": 1,
 "closeButtonIconHeight": 12,
 "class": "Window",
 "overflow": "scroll",
 "footerBackgroundColorDirection": "vertical",
 "closeButtonRollOverBackgroundColor": [
  "#C13535"
 ],
 "titlePaddingRight": 5,
 "closeButtonRollOverBackgroundColorRatios": [
  0
 ],
 "titlePaddingTop": 5,
 "minHeight": 20,
 "veilColorDirection": "horizontal",
 "headerBorderSize": 0,
 "modal": true,
 "scrollBarWidth": 10,
 "scrollBarMargin": 2,
 "headerBorderColor": "#000000",
 "propagateClick": false,
 "verticalAlign": "middle",
 "footerBackgroundColor": [
  "#FFFFFF",
  "#EEEEEE",
  "#DDDDDD"
 ],
 "titlePaddingBottom": 5,
 "paddingRight": 0,
 "closeButtonPressedBackgroundColorRatios": [
  0
 ],
 "backgroundColor": [],
 "footerBackgroundColorRatios": [
  0,
  0.9,
  1
 ],
 "titleFontWeight": "bold",
 "bodyBackgroundOpacity": 1,
 "minWidth": 20,
 "shadowVerticalLength": 0,
 "title": "MUSHOLA",
 "borderSize": 0,
 "height": 600,
 "headerPaddingLeft": 10,
 "titleFontStyle": "normal",
 "bodyBackgroundColor": [
  "#FFFFFF",
  "#DDDDDD",
  "#FFFFFF"
 ],
 "bodyPaddingLeft": 5,
 "contentOpaque": false,
 "footerHeight": 5,
 "headerPaddingRight": 10,
 "shadow": true,
 "hideEffect": {
  "class": "FadeOutEffect",
  "duration": 500,
  "easing": "cubic_in_out"
 },
 "scrollBarColor": "#000000",
 "backgroundColorDirection": "vertical",
 "headerBackgroundOpacity": 1,
 "headerBackgroundColor": [
  "#DDDDDD",
  "#EEEEEE",
  "#FFFFFF"
 ],
 "bodyBorderColor": "#000000",
 "veilShowEffect": {
  "class": "FadeInEffect",
  "duration": 500,
  "easing": "cubic_in_out"
 },
 "bodyBackgroundColorRatios": [
  0,
  0.5,
  1
 ],
 "closeButtonBackgroundColorRatios": [],
 "scrollBarOpacity": 0.5,
 "titleTextDecoration": "none",
 "closeButtonIconLineWidth": 2,
 "bodyPaddingTop": 5,
 "children": [
  "this.htmlText_5DCED4A5_4FF8_F4EE_41B7_87276E096C3E"
 ],
 "veilColor": [
  "#000000",
  "#000000"
 ],
 "shadowBlurRadius": 6,
 "scrollBarVisible": "rollOver",
 "shadowColor": "#000000",
 "headerPaddingTop": 10,
 "veilColorRatios": [
  0,
  1
 ],
 "closeButtonRollOverIconColor": "#FFFFFF",
 "closeButtonBorderRadius": 11,
 "layout": "vertical",
 "shadowOpacity": 0.5,
 "bodyBackgroundColorDirection": "vertical",
 "borderRadius": 5,
 "veilHideEffect": {
  "class": "FadeOutEffect",
  "duration": 500,
  "easing": "cubic_in_out"
 },
 "backgroundColorRatios": [],
 "headerPaddingBottom": 10,
 "titleFontSize": "2vh",
 "headerBackgroundColorRatios": [
  0,
  0.1,
  1
 ],
 "closeButtonPressedIconColor": "#FFFFFF",
 "closeButtonIconWidth": 12,
 "titlePaddingLeft": 5,
 "veilOpacity": 0.4,
 "closeButtonPressedBackgroundColor": [
  "#3A1D1F"
 ],
 "gap": 10,
 "paddingBottom": 0,
 "closeButtonIconColor": "#000000",
 "paddingTop": 0,
 "headerVerticalAlign": "middle",
 "bodyPaddingBottom": 5,
 "bodyPaddingRight": 5,
 "showEffect": {
  "class": "FadeInEffect",
  "duration": 500,
  "easing": "cubic_in_out"
 },
 "bodyBorderSize": 0,
 "shadowHorizontalLength": 3,
 "headerBackgroundColorDirection": "vertical",
 "data": {
  "name": "Window3583"
 },
 "titleFontFamily": "Arial",
 "closeButtonBackgroundColor": [],
 "paddingLeft": 0
},
{
 "items": [
  {
   "begin": "this.MapViewerMapPlayer.set('movementMode', 'free_drag_and_rotation')",
   "media": "this.map_3D35B000_2D00_6AE3_41B3_814517E43860",
   "player": "this.MapViewerMapPlayer",
   "class": "MapPlayListItem"
  }
 ],
 "id": "playList_4503C799_5371_F5DD_41C9_D090AC6BE9D3",
 "class": "PlayList"
},
{
 "initialPosition": {
  "yaw": -174,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "targetYaw": 0,
    "class": "TargetPanoramaCameraMovement",
    "path": "shortest",
    "targetPitch": 0,
    "pitchSpeed": 36.37,
    "easing": "cubic_in_out",
    "yawSpeed": 72.06
   },
   {
    "targetYaw": 78.76,
    "class": "TargetPanoramaCameraMovement",
    "path": "shortest",
    "targetPitch": -5.63,
    "pitchSpeed": 17.05,
    "easing": "cubic_in_out",
    "yawSpeed": 33.25
   },
   {
    "targetYaw": 170.47,
    "class": "TargetPanoramaCameraMovement",
    "path": "shortest",
    "targetPitch": -5.33,
    "pitchSpeed": 17.05,
    "easing": "cubic_in_out",
    "yawSpeed": 33.25
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_440798D4_5371_FBAA_41AB_8A21A3FD773F",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": -160.83,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "targetYaw": 0,
    "class": "TargetPanoramaCameraMovement",
    "path": "shortest",
    "targetPitch": 0,
    "pitchSpeed": 21.66,
    "easing": "cubic_in_out",
    "yawSpeed": 42.52
   },
   {
    "targetYaw": -124.93,
    "class": "TargetPanoramaCameraMovement",
    "path": "shortest",
    "targetPitch": -0.79,
    "pitchSpeed": 17.05,
    "easing": "cubic_in_out",
    "yawSpeed": 33.25
   },
   {
    "targetYaw": 130.2,
    "class": "TargetPanoramaCameraMovement",
    "path": "shortest",
    "targetPitch": -2.29,
    "pitchSpeed": 17.05,
    "easing": "cubic_in_out",
    "yawSpeed": 33.25
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_44DDB90A_5371_FABE_41D0_987FC70AFE40",
 "automaticZoomSpeed": 10
},
{
 "initialPosition": {
  "yaw": -142.08,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "targetYaw": 0,
    "class": "TargetPanoramaCameraMovement",
    "path": "shortest",
    "targetPitch": 0,
    "pitchSpeed": 23.26,
    "easing": "cubic_in_out",
    "yawSpeed": 45.73
   },
   {
    "targetYaw": 102.37,
    "class": "TargetPanoramaCameraMovement",
    "path": "shortest",
    "targetPitch": 3.45,
    "pitchSpeed": 17.05,
    "easing": "cubic_in_out",
    "yawSpeed": 33.25
   },
   {
    "targetYaw": -104.64,
    "class": "TargetPanoramaCameraMovement",
    "path": "shortest",
    "targetPitch": 1.34,
    "pitchSpeed": 17.05,
    "easing": "cubic_in_out",
    "yawSpeed": 33.25
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "camera_44BFF91D_5371_FAD5_41C7_4E2AD29E891B",
 "automaticZoomSpeed": 10
},
{
 "displayOriginPosition": {
  "hfov": 165,
  "yaw": 0,
  "class": "RotationalCameraDisplayPosition",
  "pitch": -90,
  "stereographicFactor": 1
 },
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "targetYaw": -143.39,
    "class": "TargetPanoramaCameraMovement",
    "path": "shortest",
    "targetPitch": -3.52,
    "pitchSpeed": 17.05,
    "easing": "cubic_in_out",
    "yawSpeed": 33.25
   },
   {
    "targetYaw": -61.38,
    "class": "TargetPanoramaCameraMovement",
    "path": "shortest",
    "targetPitch": -1.09,
    "pitchSpeed": 17.05,
    "easing": "cubic_in_out",
    "yawSpeed": 33.25
   }
  ],
  "restartMovementOnUserInteraction": false
 },
 "id": "panorama_20049CCB_2D00_5B65_41B2_9F7305A7E252_camera",
 "displayMovements": [
  {
   "class": "TargetRotationalCameraDisplayMovement",
   "duration": 1000,
   "easing": "linear"
  },
  {
   "targetPitch": 0,
   "targetStereographicFactor": 0,
   "class": "TargetRotationalCameraDisplayMovement",
   "duration": 3000,
   "easing": "cubic_in_out"
  }
 ],
 "automaticZoomSpeed": 10
},
{
 "paddingLeft": 0,
 "id": "MainViewer",
 "left": 0,
 "playbackBarProgressBorderRadius": 0,
 "playbackBarRight": 0,
 "progressBarBorderSize": 0,
 "playbackBarProgressBorderSize": 0,
 "class": "ViewerArea",
 "width": "100%",
 "progressBarBorderRadius": 0,
 "toolTipShadowOpacity": 0,
 "playbackBarBorderRadius": 0,
 "minHeight": 50,
 "playbackBarProgressBorderColor": "#000000",
 "toolTipFontStyle": "normal",
 "toolTipFontFamily": "Georgia",
 "playbackBarHeadBorderColor": "#000000",
 "toolTipTextShadowOpacity": 0,
 "transitionDuration": 500,
 "progressLeft": 0,
 "propagateClick": true,
 "playbackBarHeadBorderSize": 0,
 "playbackBarProgressOpacity": 1,
 "playbackBarHeadBorderRadius": 0,
 "playbackBarBorderSize": 0,
 "paddingRight": 0,
 "minWidth": 100,
 "vrPointerSelectionColor": "#FF6600",
 "playbackBarBackgroundOpacity": 1,
 "borderSize": 0,
 "toolTipFontColor": "#FFFFFF",
 "toolTipBackgroundColor": "#000000",
 "playbackBarHeadShadowColor": "#000000",
 "height": "100%",
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "vrPointerSelectionTime": 2000,
 "progressRight": 0,
 "progressOpacity": 1,
 "shadow": false,
 "progressBarBackgroundColorDirection": "vertical",
 "firstTransitionDuration": 0,
 "progressBottom": 0,
 "progressHeight": 10,
 "playbackBarHeadShadow": true,
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "progressBackgroundOpacity": 1,
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "playbackBarOpacity": 1,
 "toolTipPaddingRight": 10,
 "playbackBarHeadShadowOpacity": 0.7,
 "toolTipBorderSize": 1,
 "toolTipPaddingLeft": 10,
 "toolTipPaddingTop": 7,
 "vrPointerColor": "#FFFFFF",
 "toolTipDisplayTime": 600,
 "progressBarOpacity": 1,
 "transitionMode": "blending",
 "progressBorderSize": 0,
 "playbackBarBorderColor": "#FFFFFF",
 "playbackBarHeadShadowVerticalLength": 0,
 "toolTipBorderRadius": 3,
 "borderRadius": 0,
 "displayTooltipInTouchScreens": true,
 "progressBorderRadius": 0,
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "playbackBarLeft": 0,
 "progressBackgroundColorRatios": [
  0.01
 ],
 "top": 0,
 "playbackBarHeadShadowBlurRadius": 3,
 "playbackBarHeadHeight": 15,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "progressBarBorderColor": "#0066FF",
 "toolTipBorderColor": "#767676",
 "progressBarBackgroundColorRatios": [
  0
 ],
 "progressBackgroundColorDirection": "vertical",
 "toolTipShadowSpread": 0,
 "toolTipShadowBlurRadius": 3,
 "playbackBarBottom": 5,
 "toolTipTextShadowColor": "#000000",
 "progressBorderColor": "#FFFFFF",
 "playbackBarHeadOpacity": 1,
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "toolTipFontSize": "13px",
 "paddingBottom": 0,
 "toolTipPaddingBottom": 7,
 "toolTipTextShadowBlurRadius": 3,
 "paddingTop": 0,
 "playbackBarHeadShadowHorizontalLength": 0,
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "toolTipShadowColor": "#333333",
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "toolTipOpacity": 0.5,
 "playbackBarHeight": 10,
 "data": {
  "name": "Main Viewer"
 },
 "toolTipFontWeight": "normal",
 "playbackBarBackgroundColorDirection": "vertical",
 "playbackBarHeadWidth": 6
},
{
 "horizontalAlign": "left",
 "children": [
  "this.Container_7FF1F5EF_706F_7FC6_41C7_BCBB555D2D3D",
  "this.Container_7DB20382_7065_343F_4186_6E0B0B3AFF36"
 ],
 "id": "Container_7F59BED9_7065_6DCD_41D6_B4AD3EEA9174",
 "left": "0%",
 "width": 250.7,
 "backgroundOpacity": 0,
 "class": "Container",
 "overflow": "scroll",
 "borderRadius": 0,
 "minHeight": 1,
 "scrollBarWidth": 10,
 "propagateClick": false,
 "top": "0%",
 "paddingRight": 0,
 "minWidth": 1,
 "verticalAlign": "top",
 "scrollBarVisible": "rollOver",
 "gap": 10,
 "borderSize": 0,
 "paddingBottom": 0,
 "height": "100%",
 "paddingTop": 0,
 "contentOpaque": false,
 "shadow": false,
 "scrollBarColor": "#000000",
 "data": {
  "name": "--- LEFT PANEL"
 },
 "scrollBarMargin": 2,
 "layout": "absolute",
 "paddingLeft": 0,
 "scrollBarOpacity": 0.5
},
{
 "horizontalAlign": "left",
 "children": [
  "this.Container_EF8F8BD8_E386_8E02_41E5_FC5C5513733A",
  "this.Container_EF8F8BD8_E386_8E02_41E5_90850B5F0BBE"
 ],
 "id": "Container_EF8F8BD8_E386_8E03_41E3_4CF7CC1F4D8E",
 "width": 115.05,
 "backgroundOpacity": 0,
 "class": "Container",
 "right": "0%",
 "overflow": "scroll",
 "borderRadius": 0,
 "minHeight": 1,
 "scrollBarWidth": 10,
 "propagateClick": true,
 "top": "0%",
 "paddingRight": 0,
 "minWidth": 1,
 "verticalAlign": "top",
 "scrollBarVisible": "rollOver",
 "gap": 10,
 "borderSize": 0,
 "paddingBottom": 0,
 "height": 641,
 "paddingTop": 0,
 "contentOpaque": false,
 "shadow": false,
 "scrollBarColor": "#000000",
 "data": {
  "name": "-- SETTINGS"
 },
 "scrollBarMargin": 2,
 "layout": "absolute",
 "paddingLeft": 0,
 "scrollBarOpacity": 0.5
},
{
 "horizontalAlign": "left",
 "id": "Container_22BB12F4_3075_D173_4184_EC3BC4955417",
 "left": 70,
 "width": 550,
 "backgroundOpacity": 0,
 "class": "Container",
 "overflow": "visible",
 "borderRadius": 0,
 "minHeight": 1,
 "scrollBarWidth": 10,
 "propagateClick": true,
 "top": 34,
 "paddingRight": 0,
 "minWidth": 1,
 "verticalAlign": "top",
 "scrollBarVisible": "rollOver",
 "gap": 10,
 "borderSize": 0,
 "paddingBottom": 0,
 "height": 140,
 "paddingTop": 0,
 "contentOpaque": false,
 "shadow": false,
 "scrollBarColor": "#000000",
 "data": {
  "name": "--STICKER"
 },
 "scrollBarMargin": 2,
 "layout": "absolute",
 "paddingLeft": 0,
 "scrollBarOpacity": 0.5
},
{
 "scrollBarMargin": 2,
 "children": [
  "this.Container_062A782F_1140_E20B_41AF_B3E5DE341773",
  "this.Container_062A9830_1140_E215_41A7_5F2BBE5C20E4"
 ],
 "id": "Container_062AB830_1140_E215_41AF_6C9D65345420",
 "left": "0%",
 "backgroundOpacity": 0.6,
 "class": "Container",
 "right": "0%",
 "horizontalAlign": "left",
 "overflow": "scroll",
 "minHeight": 1,
 "click": "this.setComponentVisibility(this.Container_062AB830_1140_E215_41AF_6C9D65345420, false, 0, null, null, false); this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_7FF1F5EF_706F_7FC6_41C7_BCBB555D2D3D, true, 0, null, null, false)",
 "borderRadius": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarWidth": 10,
 "propagateClick": true,
 "top": "0%",
 "bottom": "0%",
 "paddingRight": 0,
 "minWidth": 1,
 "verticalAlign": "top",
 "scrollBarVisible": "rollOver",
 "borderSize": 0,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "gap": 10,
 "paddingBottom": 0,
 "creationPolicy": "inAdvance",
 "contentOpaque": false,
 "shadow": false,
 "scrollBarColor": "#000000",
 "backgroundColorDirection": "vertical",
 "paddingTop": 0,
 "visible": false,
 "data": {
  "name": "--INFO photo"
 },
 "layout": "absolute",
 "paddingLeft": 0,
 "scrollBarOpacity": 0.5
},
{
 "scrollBarMargin": 2,
 "children": [
  "this.Container_39A197B1_0C06_62AF_419A_D15E4DDD2528"
 ],
 "id": "Container_39DE87B1_0C06_62AF_417B_8CB0FB5C9D15",
 "left": "0%",
 "backgroundOpacity": 0.6,
 "class": "Container",
 "right": "0%",
 "horizontalAlign": "left",
 "overflow": "scroll",
 "minHeight": 1,
 "click": "this.setComponentVisibility(this.Container_39DE87B1_0C06_62AF_417B_8CB0FB5C9D15, false, 0, null, null, false); this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_7FF1F5EF_706F_7FC6_41C7_BCBB555D2D3D, true, 0, null, null, false)",
 "borderRadius": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarWidth": 10,
 "propagateClick": true,
 "top": "0%",
 "bottom": "0%",
 "paddingRight": 0,
 "minWidth": 1,
 "verticalAlign": "top",
 "scrollBarVisible": "rollOver",
 "borderSize": 0,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "gap": 10,
 "paddingBottom": 0,
 "creationPolicy": "inAdvance",
 "contentOpaque": false,
 "shadow": false,
 "scrollBarColor": "#000000",
 "backgroundColorDirection": "vertical",
 "paddingTop": 0,
 "visible": false,
 "data": {
  "name": "--PANORAMA LIST"
 },
 "layout": "absolute",
 "paddingLeft": 0,
 "scrollBarOpacity": 0.5
},
{
 "scrollBarMargin": 2,
 "children": [
  "this.Container_221C1648_0C06_E5FD_4180_8A2E8B66315E",
  "this.Container_221B3648_0C06_E5FD_4199_FCE031AE003B"
 ],
 "id": "Container_221B1648_0C06_E5FD_417F_E6FCCCB4A6D7",
 "left": "0%",
 "backgroundOpacity": 0.6,
 "class": "Container",
 "right": "0%",
 "horizontalAlign": "left",
 "overflow": "scroll",
 "minHeight": 1,
 "click": "this.setComponentVisibility(this.Container_221B1648_0C06_E5FD_417F_E6FCCCB4A6D7, false, 0, null, null, false); this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_7FF1F5EF_706F_7FC6_41C7_BCBB555D2D3D, true, 0, null, null, false); this.openLink('https://www.google.com/maps/place/Yayasan+Wangsakerta/@-6.7809146,108.5519752,17.18z/data=!4m10!1m2!2m1!1swangsakerta!3m6!1s0x2e6f1dcc287151b1:0xf21102e967a58453!8m2!3d-6.7811497!4d108.5553819!15sCgt3YW5nc2FrZXJ0YZIBF2FncmljdWx0dXJhbF9wcm9kdWN0aW9u4AEA!16s%2Fg%2F11sf0f1brn?entry=ttu&g_ep=EgoyMDI2MDIwNC4wIKXMDSoKLDEwMDc5MjA3M0gBUAM%3D', '_blank')",
 "borderRadius": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarWidth": 10,
 "propagateClick": true,
 "top": "0%",
 "bottom": "0%",
 "paddingRight": 0,
 "minWidth": 1,
 "verticalAlign": "top",
 "scrollBarVisible": "rollOver",
 "borderSize": 0,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "gap": 10,
 "paddingBottom": 0,
 "creationPolicy": "inAdvance",
 "contentOpaque": false,
 "shadow": false,
 "scrollBarColor": "#000000",
 "backgroundColorDirection": "vertical",
 "paddingTop": 0,
 "visible": false,
 "data": {
  "name": "--LOCATION"
 },
 "layout": "absolute",
 "paddingLeft": 0,
 "scrollBarOpacity": 0.5
},
{
 "scrollBarMargin": 2,
 "children": [
  "this.Container_2F8A6686_0D4F_6B71_4174_A02FE43588D3"
 ],
 "id": "Container_2F8BB687_0D4F_6B7F_4190_9490D02FBC41",
 "left": "0%",
 "backgroundOpacity": 0.6,
 "class": "Container",
 "right": "0%",
 "horizontalAlign": "left",
 "overflow": "scroll",
 "minHeight": 1,
 "click": "this.setComponentVisibility(this.Container_2F8BB687_0D4F_6B7F_4190_9490D02FBC41, false, 0, null, null, false); this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_7FF1F5EF_706F_7FC6_41C7_BCBB555D2D3D, true, 0, null, null, false)",
 "borderRadius": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarWidth": 10,
 "propagateClick": true,
 "top": "0%",
 "bottom": "0%",
 "paddingRight": 0,
 "minWidth": 1,
 "verticalAlign": "top",
 "scrollBarVisible": "rollOver",
 "borderSize": 0,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "gap": 10,
 "paddingBottom": 0,
 "creationPolicy": "inAdvance",
 "contentOpaque": false,
 "shadow": false,
 "scrollBarColor": "#000000",
 "backgroundColorDirection": "vertical",
 "paddingTop": 0,
 "visible": false,
 "data": {
  "name": "--FLOORPLAN"
 },
 "layout": "absolute",
 "paddingLeft": 0,
 "scrollBarOpacity": 0.5
},
{
 "scrollBarMargin": 2,
 "children": [
  "this.Container_2A193C4C_0D3B_DFF0_4161_A2CD128EF536"
 ],
 "id": "Container_2A1A5C4D_0D3B_DFF0_41A9_8FC811D03C8E",
 "left": "0%",
 "backgroundOpacity": 0.6,
 "class": "Container",
 "right": "0%",
 "horizontalAlign": "left",
 "overflow": "scroll",
 "minHeight": 1,
 "click": "this.setComponentVisibility(this.Container_2A1A5C4D_0D3B_DFF0_41A9_8FC811D03C8E, false, 0, null, null, false); this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_7FF1F5EF_706F_7FC6_41C7_BCBB555D2D3D, true, 0, null, null, false)",
 "borderRadius": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarWidth": 10,
 "propagateClick": true,
 "top": "0%",
 "bottom": "0%",
 "paddingRight": 0,
 "minWidth": 1,
 "verticalAlign": "top",
 "scrollBarVisible": "rollOver",
 "borderSize": 0,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "gap": 10,
 "paddingBottom": 0,
 "creationPolicy": "inAdvance",
 "contentOpaque": false,
 "shadow": false,
 "scrollBarColor": "#000000",
 "backgroundColorDirection": "vertical",
 "paddingTop": 0,
 "visible": false,
 "data": {
  "name": "--PHOTOALBUM"
 },
 "layout": "absolute",
 "paddingLeft": 0,
 "scrollBarOpacity": 0.5
},
{
 "scrollBarMargin": 2,
 "children": [
  "this.Container_06C5DBA5_1140_A63F_41AD_1D83A33F1255",
  "this.Container_06C43BA5_1140_A63F_41A1_96DC8F4CAD2F"
 ],
 "id": "Container_06C41BA5_1140_A63F_41AE_B0CBD78DEFDC",
 "left": "0%",
 "backgroundOpacity": 0.6,
 "class": "Container",
 "right": "0%",
 "horizontalAlign": "left",
 "overflow": "scroll",
 "minHeight": 1,
 "click": "this.setComponentVisibility(this.Container_06C41BA5_1140_A63F_41AE_B0CBD78DEFDC, false, 0, null, null, false); this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_7FF1F5EF_706F_7FC6_41C7_BCBB555D2D3D, true, 0, null, null, false)",
 "borderRadius": 0,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarWidth": 10,
 "propagateClick": true,
 "top": "0%",
 "bottom": "0%",
 "paddingRight": 0,
 "minWidth": 1,
 "verticalAlign": "top",
 "scrollBarVisible": "rollOver",
 "borderSize": 0,
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "gap": 10,
 "paddingBottom": 0,
 "creationPolicy": "inAdvance",
 "contentOpaque": false,
 "shadow": false,
 "scrollBarColor": "#04A3E1",
 "backgroundColorDirection": "vertical",
 "paddingTop": 0,
 "visible": false,
 "data": {
  "name": "--REALTOR"
 },
 "layout": "absolute",
 "paddingLeft": 0,
 "scrollBarOpacity": 0.5
},
{
 "maxHeight": 58,
 "horizontalAlign": "center",
 "id": "IconButton_EED073D3_E38A_9E06_41E1_6CCC9722545D",
 "width": 58,
 "backgroundOpacity": 0,
 "class": "IconButton",
 "maxWidth": 58,
 "borderRadius": 0,
 "minHeight": 1,
 "propagateClick": true,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "minWidth": 1,
 "mode": "toggle",
 "borderSize": 0,
 "pressedIconURL": "skin/IconButton_EED073D3_E38A_9E06_41E1_6CCC9722545D_pressed.png",
 "paddingBottom": 0,
 "height": 58,
 "paddingTop": 0,
 "transparencyActive": true,
 "shadow": false,
 "iconURL": "skin/IconButton_EED073D3_E38A_9E06_41E1_6CCC9722545D.png",
 "data": {
  "name": "IconButton MUTE"
 },
 "cursor": "hand",
 "paddingLeft": 0
},
{
 "maxHeight": 58,
 "horizontalAlign": "center",
 "id": "IconButton_EEFF957A_E389_9A06_41E1_2AD21904F8C0",
 "width": 58,
 "backgroundOpacity": 0,
 "class": "IconButton",
 "maxWidth": 58,
 "borderRadius": 0,
 "minHeight": 1,
 "propagateClick": true,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "minWidth": 1,
 "mode": "toggle",
 "borderSize": 0,
 "pressedIconURL": "skin/IconButton_EEFF957A_E389_9A06_41E1_2AD21904F8C0_pressed.png",
 "paddingBottom": 0,
 "height": 58,
 "paddingTop": 0,
 "transparencyActive": true,
 "shadow": false,
 "iconURL": "skin/IconButton_EEFF957A_E389_9A06_41E1_2AD21904F8C0.png",
 "data": {
  "name": "IconButton FULLSCREEN"
 },
 "cursor": "hand",
 "paddingLeft": 0
},
{
 "useHandCursor": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_21AC5DF8_2D00_3522_4192_F1EC0575A351_0_HS_0_0_0_map.gif",
      "width": 41,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -70.11,
   "hfov": 14.1,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -28.3
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_24534248_3300_367C_4193_B77F834C5911, this.camera_45A2E859_5371_FB5A_41C0_5FBFBDEDBBB9); this.mainPlayList.set('selectedIndex', 6)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "rollOverDisplay": false,
 "enabledInCardboard": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_5EADE396_4FFF_4CAB_41CE_5F1F39DE3900",
   "pitch": -28.3,
   "yaw": -70.11,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 14.1,
   "distance": 50
  }
 ],
 "id": "overlay_394392FE_2D00_EF1E_41C3_461886C27F62",
 "data": {
  "label": "Arrow 09c Left-Up"
 }
},
{
 "useHandCursor": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_21AC5DF8_2D00_3522_4192_F1EC0575A351_0_HS_1_0_0_map.gif",
      "width": 34,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -18.16,
   "hfov": 14.97,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -32.28
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_20049CCB_2D00_5B65_41B2_9F7305A7E252, this.camera_45CA282B_5371_FAFD_41CB_A12A6D5B6B17); this.mainPlayList.set('selectedIndex', 0)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "rollOverDisplay": false,
 "enabledInCardboard": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_5F72FF75_4FF9_546E_41A8_BC843ED71CF1",
   "pitch": -32.28,
   "yaw": -18.16,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 14.97,
   "distance": 100
  }
 ],
 "id": "overlay_397E4AC6_2D00_5F6F_41BE_D3ACEDC155E4",
 "data": {
  "label": "Arrow 09c"
 }
},
{
 "useHandCursor": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_21AC5DF8_2D00_3522_4192_F1EC0575A351_0_HS_2_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 90.41,
   "hfov": 12.7,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 21.16
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "areas": [
  {
   "click": "this.showWindow(this.window_42D7A8E4_5357_7B6A_41C1_8E86042FD3F1, null, false)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "rollOverDisplay": false,
 "items": [
  {
   "image": "this.AnimatedImageResource_258E604D_3500_D274_41A7_D4D32842EBD2",
   "pitch": 21.16,
   "yaw": 90.41,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 12.7,
   "distance": 100
  }
 ],
 "id": "overlay_27EBEE37_3500_CE13_41AE_3958C14C1E2A",
 "data": {
  "label": "Info 02"
 }
},
{
 "inertia": false,
 "hfov": 45,
 "angle": 0,
 "class": "TripodCapPanoramaOverlay",
 "rotate": false,
 "id": "panorama_21AC5DF8_2D00_3522_4192_F1EC0575A351_tcap0",
 "distance": 50,
 "image": {
  "levels": [
   {
    "url": "media/panorama_20049CCB_2D00_5B65_41B2_9F7305A7E252_tcap0.png",
    "width": 1267,
    "class": "ImageResourceLevel",
    "height": 1267
   }
  ],
  "class": "ImageResource"
 }
},
{
 "inertia": false,
 "hfov": 45,
 "angle": 180,
 "class": "CeilingCapPanoramaOverlay",
 "rotate": false,
 "id": "panorama_21AC5DF8_2D00_3522_4192_F1EC0575A351_ccap0",
 "distance": 50,
 "image": {
  "levels": [
   {
    "url": "media/panorama_20049CCB_2D00_5B65_41B2_9F7305A7E252_tcap0.png",
    "width": 1267,
    "class": "ImageResourceLevel",
    "height": 1267
   }
  ],
  "class": "ImageResource"
 }
},
{
 "maxHeight": 58,
 "horizontalAlign": "center",
 "id": "IconButton_EF7806FA_E38F_8606_41E5_5C4557EBCACB",
 "width": 58,
 "backgroundOpacity": 0,
 "class": "IconButton",
 "maxWidth": 58,
 "rollOverIconURL": "skin/IconButton_EF7806FA_E38F_8606_41E5_5C4557EBCACB_rollover.png",
 "borderRadius": 0,
 "minHeight": 1,
 "propagateClick": true,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "minWidth": 1,
 "mode": "push",
 "borderSize": 0,
 "paddingBottom": 0,
 "height": 58,
 "paddingTop": 0,
 "transparencyActive": true,
 "shadow": false,
 "iconURL": "skin/IconButton_EF7806FA_E38F_8606_41E5_5C4557EBCACB.png",
 "data": {
  "name": "IconButton VR"
 },
 "cursor": "hand",
 "paddingLeft": 0
},
{
 "maxHeight": 58,
 "horizontalAlign": "center",
 "id": "IconButton_EEEB3760_E38B_8603_41D6_FE6B11A3DA96",
 "width": 58,
 "backgroundOpacity": 0,
 "class": "IconButton",
 "maxWidth": 58,
 "borderRadius": 0,
 "minHeight": 1,
 "propagateClick": true,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "minWidth": 1,
 "mode": "toggle",
 "borderSize": 0,
 "pressedIconURL": "skin/IconButton_EEEB3760_E38B_8603_41D6_FE6B11A3DA96_pressed.png",
 "paddingBottom": 0,
 "height": 58,
 "paddingTop": 0,
 "transparencyActive": true,
 "shadow": false,
 "iconURL": "skin/IconButton_EEEB3760_E38B_8603_41D6_FE6B11A3DA96.png",
 "visible": false,
 "data": {
  "name": "IconButton HS "
 },
 "cursor": "hand",
 "paddingLeft": 0
},
{
 "maxHeight": 58,
 "horizontalAlign": "center",
 "id": "IconButton_EE9FBAB2_E389_8E06_41D7_903ABEDD153A",
 "width": 58,
 "backgroundOpacity": 0,
 "class": "IconButton",
 "maxWidth": 58,
 "borderRadius": 0,
 "minHeight": 1,
 "propagateClick": true,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "minWidth": 1,
 "mode": "toggle",
 "borderSize": 0,
 "pressedIconURL": "skin/IconButton_EE9FBAB2_E389_8E06_41D7_903ABEDD153A_pressed.png",
 "paddingBottom": 0,
 "height": 58,
 "paddingTop": 0,
 "transparencyActive": true,
 "shadow": false,
 "iconURL": "skin/IconButton_EE9FBAB2_E389_8E06_41D7_903ABEDD153A.png",
 "data": {
  "name": "IconButton GYRO"
 },
 "cursor": "hand",
 "paddingLeft": 0
},
{
 "id": "htmlText_42E9A399_5009_441F_41B4_032E07CFD1AC",
 "width": "100%",
 "backgroundOpacity": 0,
 "class": "HTMLText",
 "borderRadius": 0,
 "minHeight": 0,
 "scrollBarWidth": 10,
 "propagateClick": false,
 "scrollBarMargin": 2,
 "paddingRight": 10,
 "minWidth": 0,
 "scrollBarVisible": "rollOver",
 "borderSize": 0,
 "paddingBottom": 10,
 "height": "100%",
 "paddingTop": 10,
 "html": "<div style=\"text-align:left; color:#000; \"><DIV STYLE=\"text-align:justify;\"><SPAN STYLE=\"letter-spacing:0px;color:#000000;font-size:12px;font-family:Arial, Helvetica, sans-serif;\">kamar mandi tamu, ruangan khusus di dalam bangunan yang di rancang untuk aktifitas higienis pribadi, terutama untuk membersihkan tubuh, mandi, buang air, serta menyikat gigi D</SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0px;color:#000000;font-size:12px;font-family:Arial, Helvetica, sans-serif;\">sb.</SPAN></DIV></div>",
 "shadow": false,
 "scrollBarColor": "#000000",
 "data": {
  "name": "HTMLText5510"
 },
 "paddingLeft": 10,
 "scrollBarOpacity": 0.5
},
{
 "id": "htmlText_5F50674B_498E_C4B3_41BC_B9B0341B180E",
 "width": "100%",
 "backgroundOpacity": 0,
 "class": "HTMLText",
 "borderRadius": 0,
 "minHeight": 0,
 "scrollBarWidth": 10,
 "propagateClick": false,
 "scrollBarMargin": 2,
 "paddingRight": 10,
 "minWidth": 0,
 "scrollBarVisible": "rollOver",
 "borderSize": 0,
 "paddingBottom": 10,
 "height": "100%",
 "paddingTop": 10,
 "html": "<div style=\"text-align:left; color:#000; \"><p STYLE=\"margin:0; line-height:1.02vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.02vh;font-family:Arial, Helvetica, sans-serif;\"/></p></div>",
 "shadow": false,
 "scrollBarColor": "#000000",
 "data": {
  "name": "HTMLText7612"
 },
 "paddingLeft": 10,
 "scrollBarOpacity": 0.5
},
{
 "useHandCursor": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_21AC062D_2D1F_D73D_41A5_DB9BD2F0AB93_0_HS_0_0_0_map.gif",
      "width": 34,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 37.92,
   "hfov": 26.2,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -28.17
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_24534248_3300_367C_4193_B77F834C5911, this.camera_458DC889_5371_FBBA_41BA_816325809788); this.mainPlayList.set('selectedIndex', 6)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "rollOverDisplay": false,
 "enabledInCardboard": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_258EE04D_3500_D274_41BD_7FE75CBBA1EA",
   "pitch": -28.17,
   "yaw": 37.92,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 26.2,
   "distance": 100
  }
 ],
 "id": "overlay_394B0266_2D00_EF2F_41A6_67E98B4104B4",
 "data": {
  "label": "Arrow 08b"
 }
},
{
 "useHandCursor": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_21AC062D_2D1F_D73D_41A5_DB9BD2F0AB93_0_HS_1_0_0_map.gif",
      "width": 34,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -16.56,
   "hfov": 25.65,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -30.3
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_25DD65E0_3303_F22C_41B8_CCEDFF035B4E, this.camera_45B44877_5371_FB56_41C6_B8A36E4AA649); this.mainPlayList.set('selectedIndex', 7)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "rollOverDisplay": false,
 "enabledInCardboard": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_258EC04D_3500_D277_41C1_2F7881667241",
   "pitch": -30.3,
   "yaw": -16.56,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 25.65,
   "distance": 100
  }
 ],
 "id": "overlay_39F8FF81_2D00_55E9_41A7_94D752B9DBF4",
 "data": {
  "label": "Arrow 08b"
 }
},
{
 "useHandCursor": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_21AC062D_2D1F_D73D_41A5_DB9BD2F0AB93_0_HS_2_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 80.72,
   "hfov": 13.56,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -5.47
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "rollOverDisplay": false,
 "enabledInCardboard": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_258E904E_3500_D274_41C2_7AE86461CE99",
   "pitch": -5.47,
   "yaw": 80.72,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 13.56,
   "distance": 100
  }
 ],
 "id": "overlay_271F8D7D_3500_7214_41A3_2006477E7E72",
 "data": {
  "label": "Info 02"
 }
},
{
 "inertia": false,
 "hfov": 45,
 "angle": 0,
 "class": "TripodCapPanoramaOverlay",
 "rotate": false,
 "id": "panorama_21AC062D_2D1F_D73D_41A5_DB9BD2F0AB93_tcap0",
 "distance": 50,
 "image": {
  "levels": [
   {
    "url": "media/panorama_20049CCB_2D00_5B65_41B2_9F7305A7E252_tcap0.png",
    "width": 1267,
    "class": "ImageResourceLevel",
    "height": 1267
   }
  ],
  "class": "ImageResource"
 }
},
{
 "inertia": false,
 "hfov": 45,
 "angle": 180,
 "class": "CeilingCapPanoramaOverlay",
 "rotate": false,
 "id": "panorama_21AC062D_2D1F_D73D_41A5_DB9BD2F0AB93_ccap0",
 "distance": 50,
 "image": {
  "levels": [
   {
    "url": "media/panorama_20049CCB_2D00_5B65_41B2_9F7305A7E252_tcap0.png",
    "width": 1267,
    "class": "ImageResourceLevel",
    "height": 1267
   }
  ],
  "class": "ImageResource"
 }
},
{
 "useHandCursor": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_21ADDE3C_2D1F_D722_41BE_FEAA4D868562_0_HS_0_0_0_map.gif",
      "width": 34,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 19.17,
   "hfov": 24.78,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -33.48
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_21AC564D_2D1F_F762_41C4_CE95FB3A18CF, this.camera_44C308F8_5371_FB5A_41C2_3D96CECEACB5); this.mainPlayList.set('selectedIndex', 5); this.mainPlayList.set('selectedIndex', 5)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "rollOverDisplay": false,
 "enabledInCardboard": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_258D304E_3500_D274_41BE_8C9E3211EFB5",
   "pitch": -33.48,
   "yaw": 19.17,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 24.78,
   "distance": 100
  }
 ],
 "id": "overlay_39C97D21_2D00_3525_41A4_DC45B062663D",
 "data": {
  "label": "Arrow 08b"
 }
},
{
 "useHandCursor": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_21ADDE3C_2D1F_D722_41BE_FEAA4D868562_0_HS_1_0_0_map.gif",
      "width": 34,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 143.1,
   "hfov": 25.54,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -30.76
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_25DD65E0_3303_F22C_41B8_CCEDFF035B4E, this.camera_440798D4_5371_FBAA_41AB_8A21A3FD773F); this.mainPlayList.set('selectedIndex', 7)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "rollOverDisplay": false,
 "enabledInCardboard": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_258C2050_3500_D26C_41B4_02C2D96869A6",
   "pitch": -30.76,
   "yaw": 143.1,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 25.54,
   "distance": 100
  }
 ],
 "id": "overlay_392378B4_2D00_FB23_41B6_2C7B31861EB5",
 "data": {
  "label": "Arrow 08b"
 }
},
{
 "useHandCursor": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_21ADDE3C_2D1F_D722_41BE_FEAA4D868562_0_HS_2_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 68.16,
   "hfov": 12.59,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -22.43
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 0); this.mainPlayList.set('selectedIndex', 0)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "rollOverDisplay": false,
 "enabledInCardboard": true,
 "items": [
  {
   "yaw": 68.16,
   "distance": 50,
   "image": {
    "levels": [
     {
      "url": "media/panorama_21ADDE3C_2D1F_D722_41BE_FEAA4D868562_0_HS_2_0.png",
      "width": 135,
      "class": "ImageResourceLevel",
      "height": 135
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -22.43,
   "hfov": 12.59,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_39D8143D_2D00_EB22_4196_13996269A211",
 "data": {
  "label": "Image"
 }
},
{
 "useHandCursor": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_21ADDE3C_2D1F_D722_41BE_FEAA4D868562_0_HS_3_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 25.65,
   "hfov": 13.62,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -1.38
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "rollOverDisplay": false,
 "enabledInCardboard": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_258CD050_3500_D26C_41C5_883F9F4D8D9E",
   "pitch": -1.38,
   "yaw": 25.65,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 13.62,
   "distance": 100
  }
 ],
 "id": "overlay_249FF9EB_3503_D23C_41B8_152DB2B67A74",
 "data": {
  "label": "Info 02"
 }
},
{
 "inertia": false,
 "hfov": 45,
 "angle": 0,
 "class": "TripodCapPanoramaOverlay",
 "rotate": false,
 "id": "panorama_21ADDE3C_2D1F_D722_41BE_FEAA4D868562_tcap0",
 "distance": 50,
 "image": {
  "levels": [
   {
    "url": "media/panorama_20049CCB_2D00_5B65_41B2_9F7305A7E252_tcap0.png",
    "width": 1267,
    "class": "ImageResourceLevel",
    "height": 1267
   }
  ],
  "class": "ImageResource"
 }
},
{
 "inertia": false,
 "hfov": 45,
 "angle": 180,
 "class": "CeilingCapPanoramaOverlay",
 "rotate": false,
 "id": "panorama_21ADDE3C_2D1F_D722_41BE_FEAA4D868562_ccap0",
 "distance": 50,
 "image": {
  "levels": [
   {
    "url": "media/panorama_20049CCB_2D00_5B65_41B2_9F7305A7E252_tcap0.png",
    "width": 1267,
    "class": "ImageResourceLevel",
    "height": 1267
   }
  ],
  "class": "ImageResource"
 }
},
{
 "id": "htmlText_42D768E9_5357_7B7D_41D1_FA7F4E886E9A",
 "width": "100%",
 "backgroundOpacity": 0,
 "class": "HTMLText",
 "borderRadius": 0,
 "minHeight": 0,
 "scrollBarWidth": 10,
 "propagateClick": false,
 "scrollBarMargin": 2,
 "paddingRight": 10,
 "minWidth": 0,
 "scrollBarVisible": "rollOver",
 "borderSize": 0,
 "paddingBottom": 10,
 "height": "100%",
 "paddingTop": 10,
 "html": "<div style=\"text-align:left; color:#000; \"><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0px;color:#000000;font-size:12px;font-family:Arial, Helvetica, sans-serif;\">Rumah pengeringan (greenhouse dryer atau solar dryer dome) adalah bangunan khusus, seringkali berbahan plastik UV, yang dirancang untuk mengeringkan hasil pertanian (padi, kopi, cabai) atau bahan lain secara higienis, lebih cepat, dan konsisten menggunakan energi surya. Sistem ini melindungi produk dari cuaca buruk, debu, dan hama.</SPAN></DIV></div>",
 "shadow": false,
 "scrollBarColor": "#000000",
 "data": {
  "name": "HTMLText3688"
 },
 "paddingLeft": 10,
 "scrollBarOpacity": 0.5
},
{
 "paddingLeft": 0,
 "id": "MapViewer",
 "left": 0,
 "playbackBarProgressBorderRadius": 0,
 "playbackBarRight": 0,
 "progressBarBorderSize": 0,
 "playbackBarProgressBorderSize": 0,
 "class": "ViewerArea",
 "width": "100%",
 "progressBarBorderRadius": 0,
 "toolTipShadowOpacity": 0,
 "playbackBarBorderRadius": 0,
 "minHeight": 1,
 "playbackBarProgressBorderColor": "#000000",
 "toolTipFontStyle": "normal",
 "toolTipFontFamily": "Georgia",
 "playbackBarHeadBorderColor": "#000000",
 "toolTipTextShadowOpacity": 0,
 "transitionDuration": 500,
 "progressLeft": 0,
 "propagateClick": false,
 "playbackBarHeadBorderSize": 0,
 "playbackBarProgressOpacity": 1,
 "playbackBarHeadBorderRadius": 0,
 "playbackBarBorderSize": 0,
 "paddingRight": 0,
 "minWidth": 1,
 "vrPointerSelectionColor": "#FF6600",
 "playbackBarBackgroundOpacity": 1,
 "borderSize": 0,
 "toolTipFontColor": "#FFFFFF",
 "toolTipBackgroundColor": "#000000",
 "playbackBarHeadShadowColor": "#000000",
 "height": "99.975%",
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "vrPointerSelectionTime": 2000,
 "progressRight": 0,
 "progressOpacity": 1,
 "shadow": false,
 "progressBarBackgroundColorDirection": "vertical",
 "firstTransitionDuration": 0,
 "progressBottom": 2,
 "progressHeight": 10,
 "playbackBarHeadShadow": true,
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "progressBackgroundOpacity": 1,
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "playbackBarOpacity": 1,
 "toolTipPaddingRight": 10,
 "playbackBarHeadShadowOpacity": 0.7,
 "toolTipBorderSize": 1,
 "toolTipPaddingLeft": 10,
 "toolTipPaddingTop": 7,
 "vrPointerColor": "#FFFFFF",
 "toolTipDisplayTime": 600,
 "progressBarOpacity": 1,
 "transitionMode": "blending",
 "progressBorderSize": 0,
 "playbackBarBorderColor": "#FFFFFF",
 "playbackBarHeadShadowVerticalLength": 0,
 "toolTipBorderRadius": 3,
 "borderRadius": 0,
 "displayTooltipInTouchScreens": true,
 "progressBorderRadius": 0,
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "playbackBarLeft": 0,
 "progressBackgroundColorRatios": [
  0.01
 ],
 "top": 0,
 "playbackBarHeadShadowBlurRadius": 3,
 "playbackBarHeadHeight": 15,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "progressBarBorderColor": "#0066FF",
 "toolTipBorderColor": "#767676",
 "progressBarBackgroundColorRatios": [
  0
 ],
 "progressBackgroundColorDirection": "vertical",
 "toolTipShadowSpread": 0,
 "toolTipShadowBlurRadius": 3,
 "playbackBarBottom": 0,
 "toolTipTextShadowColor": "#000000",
 "progressBorderColor": "#FFFFFF",
 "playbackBarHeadOpacity": 1,
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "toolTipFontSize": "13px",
 "paddingBottom": 0,
 "toolTipPaddingBottom": 7,
 "toolTipTextShadowBlurRadius": 3,
 "paddingTop": 0,
 "playbackBarHeadShadowHorizontalLength": 0,
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "toolTipShadowColor": "#333333",
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "toolTipOpacity": 0.5,
 "playbackBarHeight": 10,
 "data": {
  "name": "Floor Plan"
 },
 "toolTipFontWeight": "normal",
 "playbackBarBackgroundColorDirection": "vertical",
 "playbackBarHeadWidth": 6
},
{
 "useHandCursor": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_21AC564D_2D1F_F762_41C4_CE95FB3A18CF_0_HS_0_0_0_map.gif",
      "width": 34,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -12.77,
   "hfov": 24.78,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -33.48
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_21ADDE3C_2D1F_D722_41BE_FEAA4D868562, this.camera_44DDB90A_5371_FABE_41D0_987FC70AFE40); this.mainPlayList.set('selectedIndex', 4)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "rollOverDisplay": false,
 "enabledInCardboard": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_25937050_3500_D26C_41C0_DBA993F97A17",
   "pitch": -33.48,
   "yaw": -12.77,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 24.78,
   "distance": 100
  }
 ],
 "id": "overlay_38FA5FF9_2D03_D522_41B7_EE567F5DC5E8",
 "data": {
  "label": "Arrow 08b"
 }
},
{
 "useHandCursor": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_21AC564D_2D1F_F762_41C4_CE95FB3A18CF_0_HS_1_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 67.41,
   "hfov": 13.37,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -10.92
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "rollOverDisplay": false,
 "enabledInCardboard": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_25934051_3500_D26C_41C4_FF86AECA01B2",
   "pitch": -10.92,
   "yaw": 67.41,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 13.37,
   "distance": 100
  }
 ],
 "id": "overlay_24AE8CCC_3500_3274_41B6_3D39286DC236",
 "data": {
  "label": "Info 02"
 }
},
{
 "inertia": false,
 "hfov": 45,
 "angle": 0,
 "class": "TripodCapPanoramaOverlay",
 "rotate": false,
 "id": "panorama_21AC564D_2D1F_F762_41C4_CE95FB3A18CF_tcap0",
 "distance": 50,
 "image": {
  "levels": [
   {
    "url": "media/panorama_20049CCB_2D00_5B65_41B2_9F7305A7E252_tcap0.png",
    "width": 1267,
    "class": "ImageResourceLevel",
    "height": 1267
   }
  ],
  "class": "ImageResource"
 }
},
{
 "inertia": false,
 "hfov": 45,
 "angle": 180,
 "class": "CeilingCapPanoramaOverlay",
 "rotate": false,
 "id": "panorama_21AC564D_2D1F_F762_41C4_CE95FB3A18CF_ccap0",
 "distance": 50,
 "image": {
  "levels": [
   {
    "url": "media/panorama_20049CCB_2D00_5B65_41B2_9F7305A7E252_tcap0.png",
    "width": 1267,
    "class": "ImageResourceLevel",
    "height": 1267
   }
  ],
  "class": "ImageResource"
 }
},
{
 "id": "htmlText_41D8132A_5351_8EFE_41A5_D22980DFE60A",
 "width": "100%",
 "backgroundOpacity": 0,
 "class": "HTMLText",
 "borderRadius": 0,
 "minHeight": 0,
 "scrollBarWidth": 10,
 "propagateClick": false,
 "scrollBarMargin": 2,
 "paddingRight": 10,
 "minWidth": 0,
 "scrollBarVisible": "rollOver",
 "borderSize": 0,
 "paddingBottom": 10,
 "height": "100%",
 "paddingTop": 10,
 "html": "<div style=\"text-align:left; color:#000; \"><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0px;color:#000000;font-size:12px;font-family:Arial, Helvetica, sans-serif;\">pengembangbiakan hewan ternak untuk mendapatkan manfaat ekonomi dan hasil produksi seperti daging, susu, telur, kulit, dan tenaga kerja. Aktivitas ini mencakup pengelolaan sumber daya fisik, pakan, benih, serta penanganan pascapanen. </SPAN></DIV></div>",
 "shadow": false,
 "scrollBarColor": "#000000",
 "data": {
  "name": "HTMLText4486"
 },
 "paddingLeft": 10,
 "scrollBarOpacity": 0.5
},
{
 "useHandCursor": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_2183758B_2D00_35E6_41AB_8B264F8B31F8_0_HS_0_0_0_map.gif",
      "width": 34,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -62.71,
   "hfov": 11.21,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -20.16
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_20049CCB_2D00_5B65_41B2_9F7305A7E252, this.camera_442A38C2_5371_FBAE_41A5_B397B8A11EFC); this.mainPlayList.set('selectedIndex', 0)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "rollOverDisplay": false,
 "enabledInCardboard": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_5F7C0F73_4FF9_546A_41CE_3242C7F8EECD",
   "pitch": -20.16,
   "yaw": -62.71,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 11.21,
   "distance": 50
  }
 ],
 "id": "overlay_38147F55_2D00_556D_41C4_395B143BC60E",
 "data": {
  "label": "Arrow 09b Left-Up"
 }
},
{
 "useHandCursor": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_2183758B_2D00_35E6_41AB_8B264F8B31F8_0_HS_1_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 53.34,
   "hfov": 10.89,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 2.42
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "areas": [
  {
   "click": "this.showWindow(this.window_5DCEB4A5_4FF8_F4EE_41C8_6FB959689EB2, null, false)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "rollOverDisplay": false,
 "items": [
  {
   "image": "this.AnimatedImageResource_258F304D_3500_D274_41B6_9CF3A55F797E",
   "pitch": 2.42,
   "yaw": 53.34,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 10.89,
   "distance": 100
  }
 ],
 "id": "overlay_25FB1817_3500_3214_41C4_DF102A80DFD0",
 "data": {
  "label": "Info 02"
 }
},
{
 "useHandCursor": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_2183758B_2D00_35E6_41AB_8B264F8B31F8_0_HS_2_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -52.43,
   "hfov": 13.54,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 6.33
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "areas": [
  {
   "click": "this.showWindow(this.window_42E87399_5009_441F_41BE_8E383A332C38, null, false)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "rollOverDisplay": false,
 "items": [
  {
   "image": "this.AnimatedImageResource_258F004D_3500_D274_41BC_98D73107117B",
   "pitch": 6.33,
   "yaw": -52.43,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 13.54,
   "distance": 100
  }
 ],
 "id": "overlay_249EDD74_3500_D214_41B5_7A9ADF00024B",
 "data": {
  "label": "wc"
 }
},
{
 "inertia": false,
 "hfov": 45,
 "angle": 0,
 "class": "TripodCapPanoramaOverlay",
 "rotate": false,
 "id": "panorama_2183758B_2D00_35E6_41AB_8B264F8B31F8_tcap0",
 "distance": 50,
 "image": {
  "levels": [
   {
    "url": "media/panorama_20049CCB_2D00_5B65_41B2_9F7305A7E252_tcap0.png",
    "width": 1267,
    "class": "ImageResourceLevel",
    "height": 1267
   }
  ],
  "class": "ImageResource"
 }
},
{
 "inertia": false,
 "hfov": 45,
 "angle": 180,
 "class": "CeilingCapPanoramaOverlay",
 "rotate": false,
 "id": "panorama_2183758B_2D00_35E6_41AB_8B264F8B31F8_ccap0",
 "distance": 50,
 "image": {
  "levels": [
   {
    "url": "media/panorama_20049CCB_2D00_5B65_41B2_9F7305A7E252_tcap0.png",
    "width": 1267,
    "class": "ImageResourceLevel",
    "height": 1267
   }
  ],
  "class": "ImageResource"
 }
},
{
 "useHandCursor": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_24534248_3300_367C_4193_B77F834C5911_1_HS_0_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 84.71,
   "hfov": 19.37,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -28.18
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_21AC5DF8_2D00_3522_4192_F1EC0575A351, this.camera_470DE97C_5371_FD5B_41CD_0099770CD3C2); this.mainPlayList.set('selectedIndex', 2)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "rollOverDisplay": false,
 "enabledInCardboard": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_2593E051_3500_D26C_41B7_D29A783AA317",
   "pitch": -28.18,
   "yaw": 84.71,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 19.37,
   "distance": 50
  }
 ],
 "id": "overlay_242DE2FB_3300_361C_41C5_0F8AA9AD66C7",
 "data": {
  "label": "Arrow 09a Right-Up"
 }
},
{
 "useHandCursor": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_24534248_3300_367C_4193_B77F834C5911_1_HS_1_0_0_map.gif",
      "width": 34,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 23.1,
   "hfov": 20.87,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -29.39
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_21AC062D_2D1F_D73D_41A5_DB9BD2F0AB93, this.camera_44BFF91D_5371_FAD5_41C7_4E2AD29E891B); this.mainPlayList.set('selectedIndex', 3)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "rollOverDisplay": false,
 "enabledInCardboard": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_2593C051_3500_D26C_41BB_1C41DF47E62C",
   "pitch": -29.39,
   "yaw": 23.1,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 20.87,
   "distance": 100
  }
 ],
 "id": "overlay_2419A189_3300_F2FC_41A1_CB04BDEDD2A7",
 "data": {
  "label": "Arrow 08b"
 }
},
{
 "useHandCursor": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_24534248_3300_367C_4193_B77F834C5911_1_HS_2_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -75.59,
   "hfov": 10.86,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 4.81
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "areas": [
  {
   "click": "this.showWindow(this.window_41DA232A_5351_8EFE_41A2_9410326121A9, null, false)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "rollOverDisplay": false,
 "items": [
  {
   "image": "this.AnimatedImageResource_2593A051_3500_D26C_41C6_F3FC23076166",
   "pitch": 4.81,
   "yaw": -75.59,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 10.86,
   "distance": 100
  }
 ],
 "id": "overlay_275DAD42_3500_526C_419E_57B09511DE79",
 "data": {
  "label": "Info 02"
 }
},
{
 "inertia": false,
 "hfov": 45,
 "angle": 0,
 "class": "TripodCapPanoramaOverlay",
 "rotate": false,
 "id": "panorama_24534248_3300_367C_4193_B77F834C5911_tcap0",
 "distance": 50,
 "image": {
  "levels": [
   {
    "url": "media/panorama_20049CCB_2D00_5B65_41B2_9F7305A7E252_tcap0.png",
    "width": 1267,
    "class": "ImageResourceLevel",
    "height": 1267
   }
  ],
  "class": "ImageResource"
 }
},
{
 "inertia": false,
 "hfov": 45,
 "angle": 180,
 "class": "CeilingCapPanoramaOverlay",
 "rotate": false,
 "id": "panorama_24534248_3300_367C_4193_B77F834C5911_ccap0",
 "distance": 50,
 "image": {
  "levels": [
   {
    "url": "media/panorama_20049CCB_2D00_5B65_41B2_9F7305A7E252_tcap0.png",
    "width": 1267,
    "class": "ImageResourceLevel",
    "height": 1267
   }
  ],
  "class": "ImageResource"
 }
},
{
 "useHandCursor": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_25DD65E0_3303_F22C_41B8_CCEDFF035B4E_1_HS_0_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 154.66,
   "hfov": 16.88,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -22.82
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_21AC062D_2D1F_D73D_41A5_DB9BD2F0AB93, this.camera_451C77D6_5371_F556_41B6_F7B3F46F2290); this.mainPlayList.set('selectedIndex', 3)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "rollOverDisplay": false,
 "enabledInCardboard": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_25922051_3500_D26C_41C0_BE4C6787AC5A",
   "pitch": -22.82,
   "yaw": 154.66,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 16.88,
   "distance": 50
  }
 ],
 "id": "overlay_25F3714E_3300_3274_41B4_AFB06C588D63",
 "data": {
  "label": "Arrow 09a Right-Up"
 }
},
{
 "useHandCursor": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_25DD65E0_3303_F22C_41B8_CCEDFF035B4E_1_HS_1_0_0_map.gif",
      "width": 38,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": 6,
   "hfov": 19.06,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -18.78
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_21ADDE3C_2D1F_D722_41BE_FEAA4D868562, this.camera_45F237FE_5371_F556_41B4_A9831EB97CBE); this.mainPlayList.set('selectedIndex', 4)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "rollOverDisplay": false,
 "enabledInCardboard": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_25920051_3500_D26C_41C1_23B9333406DC",
   "pitch": -18.78,
   "yaw": 6,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 19.06,
   "distance": 100
  }
 ],
 "id": "overlay_2440C4A3_3300_722C_41B7_CC90052F1F71",
 "data": {
  "label": "Arrow 08c"
 }
},
{
 "useHandCursor": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_25DD65E0_3303_F22C_41B8_CCEDFF035B4E_1_HS_2_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -36.7,
   "hfov": 13.6,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": 3
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "rollOverDisplay": false,
 "enabledInCardboard": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_2592E051_3500_D26C_41B6_2D4D3500AD68",
   "pitch": 3,
   "yaw": -36.7,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 13.6,
   "distance": 100
  }
 ],
 "id": "overlay_2771C0CC_3500_7274_41B4_AF17AFD35688",
 "data": {
  "label": "Info 02"
 }
},
{
 "inertia": false,
 "hfov": 45,
 "angle": 0,
 "class": "TripodCapPanoramaOverlay",
 "rotate": false,
 "id": "panorama_25DD65E0_3303_F22C_41B8_CCEDFF035B4E_tcap0",
 "distance": 50,
 "image": {
  "levels": [
   {
    "url": "media/panorama_20049CCB_2D00_5B65_41B2_9F7305A7E252_tcap0.png",
    "width": 1267,
    "class": "ImageResourceLevel",
    "height": 1267
   }
  ],
  "class": "ImageResource"
 }
},
{
 "inertia": false,
 "hfov": 45,
 "angle": 180,
 "class": "CeilingCapPanoramaOverlay",
 "rotate": false,
 "id": "panorama_25DD65E0_3303_F22C_41B8_CCEDFF035B4E_ccap0",
 "distance": 50,
 "image": {
  "levels": [
   {
    "url": "media/panorama_20049CCB_2D00_5B65_41B2_9F7305A7E252_tcap0.png",
    "width": 1267,
    "class": "ImageResourceLevel",
    "height": 1267
   }
  ],
  "class": "ImageResource"
 }
},
{
 "useHandCursor": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_20049CCB_2D00_5B65_41B2_9F7305A7E252_0_HS_0_0_0_map.gif",
      "width": 41,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -131.27,
   "hfov": 7.1,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -24.37
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_2183758B_2D00_35E6_41AB_8B264F8B31F8, this.camera_446F089B_5371_FBDE_41B7_5DBA6D6E56C7); this.mainPlayList.set('selectedIndex', 1)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "rollOverDisplay": false,
 "enabledInCardboard": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_589D9901_498E_CCAF_41C0_BA8B5275726D",
   "pitch": -24.37,
   "yaw": -131.27,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 7.1,
   "distance": 100
  }
 ],
 "id": "overlay_3EBE8D20_2D0F_F523_41C1_1AF313362BCF",
 "data": {
  "label": "Arrow 09b"
 }
},
{
 "useHandCursor": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_20049CCB_2D00_5B65_41B2_9F7305A7E252_0_HS_1_0_0_map.gif",
      "width": 29,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -75.62,
   "hfov": 6.5,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -19.14
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_21AC5DF8_2D00_3522_4192_F1EC0575A351, this.camera_444888AF_5371_FBF6_413E_9DBD86016E90); this.mainPlayList.set('selectedIndex', 2)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "rollOverDisplay": false,
 "enabledInCardboard": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_589D3901_498E_CCAF_41CD_6FA0787C46C1",
   "pitch": -19.14,
   "yaw": -75.62,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 6.5,
   "distance": 50
  }
 ],
 "id": "overlay_388F13AC_2D00_6D23_41AB_C1301BA30D36",
 "data": {
  "label": "Arrow 09a Right-Up"
 }
},
{
 "useHandCursor": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_20049CCB_2D00_5B65_41B2_9F7305A7E252_0_HS_2_0_0_map.gif",
      "width": 16,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -9.17,
   "hfov": 10.23,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -0.2
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "areas": [
  {
   "click": "this.showWindow(this.window_5F50B74B_498E_C4B3_41BC_383BC9D585C8, null, false)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "rollOverDisplay": false,
 "items": [
  {
   "image": "this.AnimatedImageResource_589AC901_498E_CCAF_41C3_64C4A4C7B1D9",
   "pitch": -0.2,
   "yaw": -9.17,
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 10.23,
   "distance": 100
  }
 ],
 "id": "overlay_3ED44140_2D03_ED62_41C2_AD468C6CAE70",
 "data": {
  "label": "Info 02"
 }
},
{
 "inertia": false,
 "hfov": 45,
 "angle": 0,
 "class": "TripodCapPanoramaOverlay",
 "rotate": false,
 "id": "panorama_20049CCB_2D00_5B65_41B2_9F7305A7E252_tcap0",
 "distance": 50,
 "image": {
  "levels": [
   {
    "url": "media/panorama_20049CCB_2D00_5B65_41B2_9F7305A7E252_tcap0.png",
    "width": 1267,
    "class": "ImageResourceLevel",
    "height": 1267
   }
  ],
  "class": "ImageResource"
 }
},
{
 "inertia": false,
 "hfov": 45,
 "angle": 180,
 "class": "CeilingCapPanoramaOverlay",
 "rotate": false,
 "id": "panorama_20049CCB_2D00_5B65_41B2_9F7305A7E252_ccap0",
 "distance": 50,
 "image": {
  "levels": [
   {
    "url": "media/panorama_20049CCB_2D00_5B65_41B2_9F7305A7E252_tcap0.png",
    "width": 1267,
    "class": "ImageResourceLevel",
    "height": 1267
   }
  ],
  "class": "ImageResource"
 }
},
{
 "id": "htmlText_5DCED4A5_4FF8_F4EE_41B7_87276E096C3E",
 "width": "100%",
 "backgroundOpacity": 0,
 "class": "HTMLText",
 "borderRadius": 0,
 "minHeight": 0,
 "scrollBarWidth": 10,
 "propagateClick": false,
 "scrollBarMargin": 2,
 "paddingRight": 10,
 "minWidth": 0,
 "scrollBarVisible": "rollOver",
 "borderSize": 0,
 "paddingBottom": 10,
 "height": "100%",
 "paddingTop": 10,
 "html": "<div style=\"text-align:left; color:#000; \"><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0px;color:#000000;font-size:12px;font-family:Arial, Helvetica, sans-serif;\">tempat, ruangan, atau bangunan kecil yang di gunakan umat islam untuk ibadah shalat, dzikir, dan membaca Al-Qur'an.</SPAN></DIV></div>",
 "shadow": false,
 "scrollBarColor": "#000000",
 "data": {
  "name": "HTMLText3584"
 },
 "paddingLeft": 10,
 "scrollBarOpacity": 0.5
},
{
 "horizontalAlign": "left",
 "children": [
  "this.Container_7FF195EF_706F_7FC6_41D7_A104CA87824D",
  "this.IconButton_7FF185EF_706F_7FC6_41A5_21B418265412"
 ],
 "id": "Container_7FF1F5EF_706F_7FC6_41C7_BCBB555D2D3D",
 "left": "0%",
 "width": 66,
 "backgroundOpacity": 0,
 "class": "Container",
 "overflow": "scroll",
 "borderRadius": 0,
 "minHeight": 1,
 "scrollBarWidth": 10,
 "propagateClick": true,
 "top": "0%",
 "paddingRight": 0,
 "minWidth": 1,
 "verticalAlign": "top",
 "scrollBarVisible": "rollOver",
 "gap": 10,
 "borderSize": 0,
 "paddingBottom": 0,
 "height": "100%",
 "paddingTop": 0,
 "contentOpaque": false,
 "shadow": false,
 "scrollBarColor": "#000000",
 "data": {
  "name": "- COLLAPSE"
 },
 "scrollBarMargin": 2,
 "layout": "absolute",
 "paddingLeft": 0,
 "scrollBarOpacity": 0.5
},
{
 "scrollBarMargin": 2,
 "children": [
  "this.Image_7DB3C373_7065_34DE_41BA_CF5206137DED",
  "this.Container_7DB3F373_7065_34CE_41B4_E77DDA40A4F3",
  "this.Container_7DBCC382_7065_343F_41D5_9D3C36B5F479"
 ],
 "height": "100%",
 "id": "Container_7DB20382_7065_343F_4186_6E0B0B3AFF36",
 "left": "0%",
 "width": 250,
 "backgroundOpacity": 0.7,
 "class": "Container",
 "overflow": "scroll",
 "horizontalAlign": "left",
 "minHeight": 1,
 "borderRadius": 0,
 "backgroundColorRatios": [
  0
 ],
 "scrollBarWidth": 10,
 "propagateClick": true,
 "top": "0%",
 "paddingRight": 15,
 "minWidth": 1,
 "verticalAlign": "top",
 "scrollBarVisible": "rollOver",
 "gap": 10,
 "borderSize": 0,
 "paddingBottom": 15,
 "backgroundColor": [
  "#000000"
 ],
 "paddingTop": 15,
 "creationPolicy": "inAdvance",
 "contentOpaque": false,
 "shadow": false,
 "scrollBarColor": "#000000",
 "backgroundColorDirection": "vertical",
 "visible": false,
 "data": {
  "name": "- EXPANDED"
 },
 "layout": "absolute",
 "paddingLeft": 15,
 "scrollBarOpacity": 0.5
},
{
 "horizontalAlign": "center",
 "children": [
  "this.IconButton_EF8F8BD8_E386_8E02_41D6_310FF1964329"
 ],
 "id": "Container_EF8F8BD8_E386_8E02_41E5_FC5C5513733A",
 "width": 110,
 "backgroundOpacity": 0,
 "class": "Container",
 "right": "0%",
 "overflow": "visible",
 "borderRadius": 0,
 "minHeight": 1,
 "scrollBarWidth": 10,
 "propagateClick": true,
 "top": "0%",
 "paddingRight": 0,
 "minWidth": 1,
 "verticalAlign": "middle",
 "scrollBarMargin": 2,
 "scrollBarVisible": "rollOver",
 "gap": 10,
 "borderSize": 0,
 "paddingBottom": 0,
 "height": 110,
 "paddingTop": 0,
 "contentOpaque": false,
 "shadow": false,
 "scrollBarColor": "#000000",
 "data": {
  "name": "button menu sup"
 },
 "layout": "horizontal",
 "paddingLeft": 0,
 "scrollBarOpacity": 0.5
},
{
 "horizontalAlign": "center",
 "children": [
  "this.IconButton_EF7806FA_E38F_8606_41E5_5C4557EBCACB",
  "this.IconButton_EE9FBAB2_E389_8E06_41D7_903ABEDD153A",
  "this.IconButton_EED073D3_E38A_9E06_41E1_6CCC9722545D",
  "this.IconButton_EEEB3760_E38B_8603_41D6_FE6B11A3DA96",
  "this.IconButton_EEFF957A_E389_9A06_41E1_2AD21904F8C0",
  "this.IconButton_EE5807F6_E3BE_860E_41E7_431DDDA54BAC",
  "this.IconButton_EED5213F_E3B9_7A7D_41D8_1B642C004521"
 ],
 "id": "Container_EF8F8BD8_E386_8E02_41E5_90850B5F0BBE",
 "width": "91.304%",
 "backgroundOpacity": 0,
 "class": "Container",
 "right": "0%",
 "overflow": "scroll",
 "borderRadius": 0,
 "minHeight": 1,
 "click": "eval('/* CONFIG BEGINS HERE */var config = {   apiKey: \\'YOUR_OWN_GOOGLE_MAPS_API_KEY\\',   centerLat: 40.7590927,   centerLng: -73.9736084,   zoom: 13,   markers:   [       {           lat: 40.748421,           lng: -73.985517,           toolTip: \\'Go to panorama A\\',           mediaName: \\'Panorama A\\'       },       {           lat: 40.757927,           lng: -73.985559,           toolTip: \\'Go to panorama B\\',           mediaName: \\'Panorama B\\'       }   ]};/* CONFIG ENDS HERE */var player = this;var mapContainer = player.getComponentByName(\\'MapContainer\\');if (mapContainer.get(\\'children\\').length == 0){   var html = player.createInstance(\\'HTMLText\\');   html.set(\\'width\\', \\'100%\\');   html.set(\\'height\\', \\'100%\\');   html.set(\\'html\\', [       \\'<div id=\"map\" style=\"position:relative;\"></div>\\',       \\'<script src=\"https://maps.googleapis.com/maps/api/js?key=\\' + config.apiKey + \\'&callback=initMap\" async defer></script>\\'   ].join(\\'\\'));   html.bind(\\'resize\\', resize);   mapContainer.set(\\'children\\', [html]);   var map;   window.initMap = function ()   {       map = document.getElementById(\\'map\\');       var gmap = new google.maps.Map(map, {center: {lat: config.centerLat, lng: config.centerLng}, zoom: config.zoom, streetViewControl: false, fullscreenControl: false});       config.markers.forEach(function(marker)       {           var gmarker = new google.maps.Marker({position: {lat: marker.lat, lng: marker.lng}, map: gmap, title: marker.toolTip});           gmarker.addListener(\\'click\\', function() { player.setMainMediaByName(marker.mediaName); });       });       resize();   };   function resize()   {       if (!map)           return;       map.style.width = html.get(\\'actualWidth\\') + \\'px\\';       map.style.height = html.get(\\'actualHeight\\') + \\'px\\';   }}');",
 "scrollBarWidth": 10,
 "propagateClick": true,
 "scrollBarMargin": 2,
 "bottom": "0%",
 "paddingRight": 0,
 "minWidth": 1,
 "verticalAlign": "top",
 "scrollBarVisible": "rollOver",
 "borderSize": 0,
 "paddingBottom": 0,
 "height": "85.959%",
 "gap": 3,
 "contentOpaque": false,
 "shadow": false,
 "scrollBarColor": "#000000",
 "paddingTop": 0,
 "data": {
  "name": "-button set"
 },
 "layout": "vertical",
 "paddingLeft": 0,
 "scrollBarOpacity": 0.5
},
{
 "horizontalAlign": "left",
 "scrollBarOpacity": 0.5,
 "children": [
  "this.Container_062A682F_1140_E20B_41B0_3071FCBF3DC9",
  "this.Container_062A082F_1140_E20A_4193_DF1A4391DC79"
 ],
 "id": "Container_062A782F_1140_E20B_41AF_B3E5DE341773",
 "left": "15%",
 "backgroundOpacity": 1,
 "shadowColor": "#000000",
 "class": "Container",
 "right": "15%",
 "paddingLeft": 0,
 "overflow": "scroll",
 "shadowOpacity": 0.3,
 "borderRadius": 0,
 "minHeight": 1,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarWidth": 10,
 "propagateClick": false,
 "bottom": "10%",
 "paddingRight": 0,
 "minWidth": 1,
 "verticalAlign": "top",
 "scrollBarMargin": 2,
 "top": "10%",
 "shadowVerticalLength": 0,
 "scrollBarVisible": "rollOver",
 "gap": 10,
 "borderSize": 0,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "paddingBottom": 0,
 "contentOpaque": false,
 "shadow": true,
 "scrollBarColor": "#000000",
 "backgroundColorDirection": "vertical",
 "paddingTop": 0,
 "data": {
  "name": "Global"
 },
 "shadowHorizontalLength": 0,
 "layout": "horizontal",
 "shadowSpread": 1,
 "shadowBlurRadius": 25
},
{
 "horizontalAlign": "right",
 "children": [
  "this.IconButton_062A8830_1140_E215_419D_3439F16CCB3E"
 ],
 "id": "Container_062A9830_1140_E215_41A7_5F2BBE5C20E4",
 "left": "15%",
 "backgroundOpacity": 0,
 "class": "Container",
 "right": "15%",
 "overflow": "visible",
 "borderRadius": 0,
 "minHeight": 1,
 "scrollBarWidth": 10,
 "propagateClick": false,
 "top": "10%",
 "bottom": "80%",
 "paddingRight": 20,
 "minWidth": 1,
 "verticalAlign": "top",
 "scrollBarMargin": 2,
 "scrollBarVisible": "rollOver",
 "gap": 10,
 "borderSize": 0,
 "paddingBottom": 0,
 "contentOpaque": false,
 "shadow": false,
 "scrollBarColor": "#000000",
 "paddingTop": 20,
 "data": {
  "name": "Container X global"
 },
 "layout": "vertical",
 "paddingLeft": 0,
 "scrollBarOpacity": 0.5
},
{
 "horizontalAlign": "center",
 "scrollBarOpacity": 0.5,
 "children": [
  "this.Container_3A67552A_0C3A_67BD_4195_ECE46CCB34EA",
  "this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0"
 ],
 "id": "Container_39A197B1_0C06_62AF_419A_D15E4DDD2528",
 "left": "15%",
 "backgroundOpacity": 1,
 "shadowColor": "#000000",
 "class": "Container",
 "right": "15%",
 "paddingLeft": 0,
 "overflow": "visible",
 "shadowOpacity": 0.3,
 "borderRadius": 0,
 "minHeight": 1,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarWidth": 10,
 "propagateClick": false,
 "bottom": "10%",
 "paddingRight": 0,
 "minWidth": 1,
 "verticalAlign": "top",
 "scrollBarMargin": 2,
 "top": "10%",
 "shadowVerticalLength": 0,
 "scrollBarVisible": "rollOver",
 "gap": 10,
 "borderSize": 0,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "paddingBottom": 0,
 "contentOpaque": false,
 "shadow": true,
 "scrollBarColor": "#000000",
 "backgroundColorDirection": "vertical",
 "paddingTop": 0,
 "data": {
  "name": "Global"
 },
 "shadowHorizontalLength": 0,
 "layout": "absolute",
 "shadowSpread": 1,
 "shadowBlurRadius": 25
},
{
 "horizontalAlign": "left",
 "scrollBarOpacity": 0.5,
 "children": [
  "this.WebFrame_22F9EEFF_0C1A_2293_4165_411D4444EFEA"
 ],
 "id": "Container_221C1648_0C06_E5FD_4180_8A2E8B66315E",
 "left": "15%",
 "backgroundOpacity": 1,
 "shadowColor": "#000000",
 "class": "Container",
 "right": "15%",
 "paddingLeft": 0,
 "overflow": "scroll",
 "shadowOpacity": 0.3,
 "borderRadius": 0,
 "minHeight": 1,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarWidth": 10,
 "propagateClick": false,
 "bottom": "10%",
 "paddingRight": 0,
 "minWidth": 1,
 "verticalAlign": "top",
 "scrollBarMargin": 2,
 "top": "10%",
 "shadowVerticalLength": 0,
 "scrollBarVisible": "rollOver",
 "gap": 10,
 "borderSize": 0,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "paddingBottom": 0,
 "contentOpaque": false,
 "shadow": true,
 "scrollBarColor": "#000000",
 "backgroundColorDirection": "vertical",
 "paddingTop": 0,
 "data": {
  "name": "Global"
 },
 "shadowHorizontalLength": 0,
 "layout": "horizontal",
 "shadowSpread": 1,
 "shadowBlurRadius": 25
},
{
 "horizontalAlign": "right",
 "children": [
  "this.IconButton_221B2648_0C06_E5FD_41A6_F9E27CDB95AF"
 ],
 "id": "Container_221B3648_0C06_E5FD_4199_FCE031AE003B",
 "left": "15%",
 "backgroundOpacity": 0,
 "class": "Container",
 "right": "15%",
 "overflow": "visible",
 "borderRadius": 0,
 "minHeight": 1,
 "scrollBarWidth": 10,
 "propagateClick": false,
 "top": "10%",
 "bottom": "80%",
 "paddingRight": 20,
 "minWidth": 1,
 "verticalAlign": "top",
 "scrollBarMargin": 2,
 "scrollBarVisible": "rollOver",
 "gap": 10,
 "borderSize": 0,
 "paddingBottom": 0,
 "contentOpaque": false,
 "shadow": false,
 "scrollBarColor": "#000000",
 "paddingTop": 20,
 "data": {
  "name": "Container X global"
 },
 "layout": "vertical",
 "paddingLeft": 0,
 "scrollBarOpacity": 0.5
},
{
 "horizontalAlign": "center",
 "scrollBarOpacity": 0.5,
 "children": [
  "this.MapViewer",
  "this.Container_2F8A7686_0D4F_6B71_41A9_1A894413085C"
 ],
 "id": "Container_2F8A6686_0D4F_6B71_4174_A02FE43588D3",
 "left": "15%",
 "backgroundOpacity": 1,
 "shadowColor": "#000000",
 "class": "Container",
 "right": "15%",
 "paddingLeft": 0,
 "overflow": "visible",
 "shadowOpacity": 0.3,
 "borderRadius": 0,
 "minHeight": 1,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarWidth": 10,
 "propagateClick": false,
 "bottom": "10%",
 "paddingRight": 0,
 "minWidth": 1,
 "verticalAlign": "top",
 "scrollBarMargin": 2,
 "top": "10%",
 "shadowVerticalLength": 0,
 "scrollBarVisible": "rollOver",
 "gap": 10,
 "borderSize": 0,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "paddingBottom": 0,
 "contentOpaque": false,
 "shadow": true,
 "scrollBarColor": "#000000",
 "backgroundColorDirection": "vertical",
 "paddingTop": 0,
 "data": {
  "name": "Global"
 },
 "shadowHorizontalLength": 0,
 "layout": "absolute",
 "shadowSpread": 1,
 "shadowBlurRadius": 25
},
{
 "horizontalAlign": "center",
 "scrollBarOpacity": 0.5,
 "children": [
  "this.Container_2A19EC4C_0D3B_DFF0_414D_37145C22C5BC"
 ],
 "id": "Container_2A193C4C_0D3B_DFF0_4161_A2CD128EF536",
 "left": "15%",
 "backgroundOpacity": 1,
 "shadowColor": "#000000",
 "class": "Container",
 "right": "15%",
 "paddingLeft": 0,
 "overflow": "visible",
 "shadowOpacity": 0.3,
 "borderRadius": 0,
 "minHeight": 1,
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": false,
 "bottom": "10%",
 "paddingRight": 0,
 "minWidth": 1,
 "verticalAlign": "top",
 "scrollBarMargin": 2,
 "top": "10%",
 "shadowVerticalLength": 0,
 "scrollBarVisible": "rollOver",
 "gap": 10,
 "borderSize": 0,
 "scrollBarWidth": 10,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "paddingBottom": 0,
 "contentOpaque": false,
 "shadow": true,
 "scrollBarColor": "#000000",
 "backgroundColorDirection": "vertical",
 "paddingTop": 0,
 "data": {
  "name": "Global"
 },
 "shadowHorizontalLength": 0,
 "layout": "vertical",
 "shadowSpread": 1,
 "shadowBlurRadius": 25
},
{
 "horizontalAlign": "left",
 "scrollBarOpacity": 0.5,
 "children": [
  "this.Container_06C5ABA5_1140_A63F_41A9_850CF958D0DB",
  "this.Container_06C58BA5_1140_A63F_419D_EC83F94F8C54"
 ],
 "id": "Container_06C5DBA5_1140_A63F_41AD_1D83A33F1255",
 "left": "15%",
 "backgroundOpacity": 1,
 "shadowColor": "#000000",
 "class": "Container",
 "right": "15%",
 "paddingLeft": 0,
 "overflow": "scroll",
 "shadowOpacity": 0.3,
 "borderRadius": 0,
 "minHeight": 1,
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": false,
 "bottom": "10%",
 "paddingRight": 0,
 "minWidth": 1,
 "verticalAlign": "top",
 "scrollBarMargin": 2,
 "top": "10%",
 "shadowVerticalLength": 0,
 "scrollBarVisible": "rollOver",
 "gap": 10,
 "borderSize": 0,
 "scrollBarWidth": 10,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "paddingBottom": 0,
 "contentOpaque": false,
 "shadow": true,
 "scrollBarColor": "#000000",
 "backgroundColorDirection": "vertical",
 "paddingTop": 0,
 "data": {
  "name": "Global"
 },
 "shadowHorizontalLength": 0,
 "layout": "horizontal",
 "shadowSpread": 1,
 "shadowBlurRadius": 25
},
{
 "horizontalAlign": "right",
 "children": [
  "this.IconButton_06C40BA5_1140_A63F_41AC_FA560325FD81"
 ],
 "id": "Container_06C43BA5_1140_A63F_41A1_96DC8F4CAD2F",
 "left": "15%",
 "backgroundOpacity": 0,
 "class": "Container",
 "right": "15%",
 "overflow": "visible",
 "borderRadius": 0,
 "minHeight": 1,
 "scrollBarWidth": 10,
 "propagateClick": false,
 "top": "10%",
 "bottom": "80%",
 "paddingRight": 20,
 "minWidth": 1,
 "verticalAlign": "top",
 "scrollBarMargin": 2,
 "scrollBarVisible": "rollOver",
 "gap": 10,
 "borderSize": 0,
 "paddingBottom": 0,
 "contentOpaque": false,
 "shadow": false,
 "scrollBarColor": "#000000",
 "paddingTop": 20,
 "data": {
  "name": "Container X global"
 },
 "layout": "vertical",
 "paddingLeft": 0,
 "scrollBarOpacity": 0.5
},
{
 "colCount": 4,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_21AC5DF8_2D00_3522_4192_F1EC0575A351_0_HS_0_0.png",
   "width": 520,
   "class": "ImageResourceLevel",
   "height": 300
  }
 ],
 "id": "AnimatedImageResource_5EADE396_4FFF_4CAB_41CE_5F1F39DE3900",
 "rowCount": 6
},
{
 "colCount": 4,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_21AC5DF8_2D00_3522_4192_F1EC0575A351_0_HS_1_0.png",
   "width": 520,
   "class": "ImageResourceLevel",
   "height": 360
  }
 ],
 "id": "AnimatedImageResource_5F72FF75_4FF9_546E_41A8_BC843ED71CF1",
 "rowCount": 6
},
{
 "colCount": 4,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_21AC5DF8_2D00_3522_4192_F1EC0575A351_0_HS_2_0.png",
   "width": 460,
   "class": "ImageResourceLevel",
   "height": 690
  }
 ],
 "id": "AnimatedImageResource_258E604D_3500_D274_41A7_D4D32842EBD2",
 "rowCount": 6
},
{
 "colCount": 5,
 "frameCount": 32,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_21AC062D_2D1F_D73D_41A5_DB9BD2F0AB93_0_HS_0_0.png",
   "width": 600,
   "class": "ImageResourceLevel",
   "height": 385
  }
 ],
 "id": "AnimatedImageResource_258EE04D_3500_D274_41BD_7FE75CBBA1EA",
 "rowCount": 7
},
{
 "colCount": 5,
 "frameCount": 32,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_21AC062D_2D1F_D73D_41A5_DB9BD2F0AB93_0_HS_1_0.png",
   "width": 600,
   "class": "ImageResourceLevel",
   "height": 385
  }
 ],
 "id": "AnimatedImageResource_258EC04D_3500_D277_41C1_2F7881667241",
 "rowCount": 7
},
{
 "colCount": 4,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_21AC062D_2D1F_D73D_41A5_DB9BD2F0AB93_0_HS_2_0.png",
   "width": 460,
   "class": "ImageResourceLevel",
   "height": 690
  }
 ],
 "id": "AnimatedImageResource_258E904E_3500_D274_41C2_7AE86461CE99",
 "rowCount": 6
},
{
 "colCount": 5,
 "frameCount": 32,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_21ADDE3C_2D1F_D722_41BE_FEAA4D868562_0_HS_0_0.png",
   "width": 600,
   "class": "ImageResourceLevel",
   "height": 385
  }
 ],
 "id": "AnimatedImageResource_258D304E_3500_D274_41BE_8C9E3211EFB5",
 "rowCount": 7
},
{
 "colCount": 5,
 "frameCount": 32,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_21ADDE3C_2D1F_D722_41BE_FEAA4D868562_0_HS_1_0.png",
   "width": 600,
   "class": "ImageResourceLevel",
   "height": 385
  }
 ],
 "id": "AnimatedImageResource_258C2050_3500_D26C_41B4_02C2D96869A6",
 "rowCount": 7
},
{
 "colCount": 4,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_21ADDE3C_2D1F_D722_41BE_FEAA4D868562_0_HS_3_0.png",
   "width": 460,
   "class": "ImageResourceLevel",
   "height": 690
  }
 ],
 "id": "AnimatedImageResource_258CD050_3500_D26C_41C5_883F9F4D8D9E",
 "rowCount": 6
},
{
 "colCount": 5,
 "frameCount": 32,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_21AC564D_2D1F_F762_41C4_CE95FB3A18CF_0_HS_0_0.png",
   "width": 600,
   "class": "ImageResourceLevel",
   "height": 385
  }
 ],
 "id": "AnimatedImageResource_25937050_3500_D26C_41C0_DBA993F97A17",
 "rowCount": 7
},
{
 "colCount": 4,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_21AC564D_2D1F_F762_41C4_CE95FB3A18CF_0_HS_1_0.png",
   "width": 460,
   "class": "ImageResourceLevel",
   "height": 690
  }
 ],
 "id": "AnimatedImageResource_25934051_3500_D26C_41C4_FF86AECA01B2",
 "rowCount": 6
},
{
 "colCount": 4,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_2183758B_2D00_35E6_41AB_8B264F8B31F8_0_HS_0_0.png",
   "width": 520,
   "class": "ImageResourceLevel",
   "height": 360
  }
 ],
 "id": "AnimatedImageResource_5F7C0F73_4FF9_546A_41CE_3242C7F8EECD",
 "rowCount": 6
},
{
 "colCount": 4,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_2183758B_2D00_35E6_41AB_8B264F8B31F8_0_HS_1_0.png",
   "width": 460,
   "class": "ImageResourceLevel",
   "height": 690
  }
 ],
 "id": "AnimatedImageResource_258F304D_3500_D274_41B6_9CF3A55F797E",
 "rowCount": 6
},
{
 "colCount": 4,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_2183758B_2D00_35E6_41AB_8B264F8B31F8_0_HS_2_0.png",
   "width": 460,
   "class": "ImageResourceLevel",
   "height": 690
  }
 ],
 "id": "AnimatedImageResource_258F004D_3500_D274_41BC_98D73107117B",
 "rowCount": 6
},
{
 "colCount": 4,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_24534248_3300_367C_4193_B77F834C5911_1_HS_0_0.png",
   "width": 520,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "id": "AnimatedImageResource_2593E051_3500_D26C_41B7_D29A783AA317",
 "rowCount": 6
},
{
 "colCount": 5,
 "frameCount": 32,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_24534248_3300_367C_4193_B77F834C5911_1_HS_1_0.png",
   "width": 600,
   "class": "ImageResourceLevel",
   "height": 385
  }
 ],
 "id": "AnimatedImageResource_2593C051_3500_D26C_41BB_1C41DF47E62C",
 "rowCount": 7
},
{
 "colCount": 4,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_24534248_3300_367C_4193_B77F834C5911_1_HS_2_0.png",
   "width": 460,
   "class": "ImageResourceLevel",
   "height": 690
  }
 ],
 "id": "AnimatedImageResource_2593A051_3500_D26C_41C6_F3FC23076166",
 "rowCount": 6
},
{
 "colCount": 4,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_25DD65E0_3303_F22C_41B8_CCEDFF035B4E_1_HS_0_0.png",
   "width": 520,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "id": "AnimatedImageResource_25922051_3500_D26C_41C0_BE4C6787AC5A",
 "rowCount": 6
},
{
 "colCount": 5,
 "frameCount": 32,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_25DD65E0_3303_F22C_41B8_CCEDFF035B4E_1_HS_1_0.png",
   "width": 600,
   "class": "ImageResourceLevel",
   "height": 350
  }
 ],
 "id": "AnimatedImageResource_25920051_3500_D26C_41C1_23B9333406DC",
 "rowCount": 7
},
{
 "colCount": 4,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_25DD65E0_3303_F22C_41B8_CCEDFF035B4E_1_HS_2_0.png",
   "width": 460,
   "class": "ImageResourceLevel",
   "height": 690
  }
 ],
 "id": "AnimatedImageResource_2592E051_3500_D26C_41B6_2D4D3500AD68",
 "rowCount": 6
},
{
 "colCount": 4,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_20049CCB_2D00_5B65_41B2_9F7305A7E252_0_HS_0_0.png",
   "width": 520,
   "class": "ImageResourceLevel",
   "height": 300
  }
 ],
 "id": "AnimatedImageResource_589D9901_498E_CCAF_41C0_BA8B5275726D",
 "rowCount": 6
},
{
 "colCount": 4,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_20049CCB_2D00_5B65_41B2_9F7305A7E252_0_HS_1_0.png",
   "width": 520,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "id": "AnimatedImageResource_589D3901_498E_CCAF_41CD_6FA0787C46C1",
 "rowCount": 6
},
{
 "colCount": 4,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 33,
 "levels": [
  {
   "url": "media/panorama_20049CCB_2D00_5B65_41B2_9F7305A7E252_0_HS_2_0.png",
   "width": 460,
   "class": "ImageResourceLevel",
   "height": 690
  }
 ],
 "id": "AnimatedImageResource_589AC901_498E_CCAF_41C3_64C4A4C7B1D9",
 "rowCount": 6
},
{
 "horizontalAlign": "left",
 "height": "100%",
 "id": "Container_7FF195EF_706F_7FC6_41D7_A104CA87824D",
 "left": "0%",
 "width": 36,
 "backgroundOpacity": 0.4,
 "class": "Container",
 "overflow": "scroll",
 "minHeight": 1,
 "borderRadius": 0,
 "backgroundColorRatios": [
  0
 ],
 "scrollBarWidth": 10,
 "propagateClick": true,
 "top": "0%",
 "paddingRight": 0,
 "minWidth": 1,
 "verticalAlign": "top",
 "scrollBarMargin": 2,
 "scrollBarVisible": "rollOver",
 "gap": 10,
 "borderSize": 0,
 "paddingBottom": 0,
 "backgroundColor": [
  "#000000"
 ],
 "paddingTop": 0,
 "contentOpaque": false,
 "shadow": false,
 "scrollBarColor": "#000000",
 "backgroundColorDirection": "vertical",
 "visible": false,
 "data": {
  "name": "Container black"
 },
 "layout": "absolute",
 "paddingLeft": 0,
 "scrollBarOpacity": 0.5
},
{
 "maxHeight": 80,
 "horizontalAlign": "center",
 "id": "IconButton_7FF185EF_706F_7FC6_41A5_21B418265412",
 "left": 10,
 "width": 50,
 "backgroundOpacity": 0,
 "class": "IconButton",
 "maxWidth": 80,
 "rollOverIconURL": "skin/IconButton_7FF185EF_706F_7FC6_41A5_21B418265412_rollover.png",
 "borderRadius": 0,
 "minHeight": 1,
 "propagateClick": true,
 "top": "40%",
 "bottom": "40%",
 "paddingRight": 0,
 "minWidth": 1,
 "verticalAlign": "middle",
 "mode": "push",
 "borderSize": 0,
 "paddingBottom": 0,
 "iconURL": "skin/IconButton_7FF185EF_706F_7FC6_41A5_21B418265412.png",
 "click": "this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, false, 0, null, null, false); this.setComponentVisibility(this.Container_7FF1F5EF_706F_7FC6_41C7_BCBB555D2D3D, false, 0, null, null, false); this.setComponentVisibility(this.Container_7DB20382_7065_343F_4186_6E0B0B3AFF36, true, 0, null, null, false)",
 "paddingTop": 0,
 "transparencyActive": true,
 "shadow": false,
 "data": {
  "name": "IconButton arrow"
 },
 "cursor": "hand",
 "paddingLeft": 0
},
{
 "maxHeight": 1095,
 "horizontalAlign": "left",
 "id": "Image_7DB3C373_7065_34DE_41BA_CF5206137DED",
 "width": "64.25%",
 "backgroundOpacity": 0,
 "class": "Image",
 "right": "16.2%",
 "maxWidth": 1095,
 "url": "skin/Image_7DB3C373_7065_34DE_41BA_CF5206137DED.png",
 "borderRadius": 0,
 "minHeight": 30,
 "propagateClick": true,
 "top": "0%",
 "paddingRight": 0,
 "minWidth": 40,
 "verticalAlign": "top",
 "borderSize": 0,
 "paddingBottom": 0,
 "height": "24.956%",
 "paddingTop": 0,
 "shadow": false,
 "scaleMode": "fit_inside",
 "data": {
  "name": "Image Company"
 },
 "paddingLeft": 0
},
{
 "horizontalAlign": "left",
 "children": [
  "this.Container_7DB3E382_7065_343F_41C2_E1E6BB5BA055",
  "this.Button_7DB31382_7065_343F_41D6_641BBE1B2562",
  "this.Container_7DB30382_7065_343F_416C_8610BCBA9F50",
  "this.Button_7DB33382_7065_343F_41B1_0B0F019C1828",
  "this.Container_7DB32382_7065_343F_419E_6594814C420F",
  "this.Button_7DB35382_7065_343F_41C5_CF0EAF3E4CFF",
  "this.Container_7DB34382_7065_343F_41CB_A5B96E9749EE",
  "this.Button_7DB37382_7065_343F_41CC_EC41ABCCDE1B",
  "this.Container_7DBC9382_7065_343F_41CC_ED357655BB95",
  "this.Button_7DBC8382_7065_343F_4183_17B44518DB40",
  "this.Container_7DBCB382_7065_343F_41D8_AB382D384291",
  "this.Button_7DBCA382_7065_343F_41DB_48D975E3D9EC",
  "this.Container_7DBCD382_7065_343F_41D8_FC14DFF91DA9"
 ],
 "id": "Container_7DB3F373_7065_34CE_41B4_E77DDA40A4F3",
 "width": "100%",
 "backgroundOpacity": 0,
 "class": "Container",
 "right": "0%",
 "overflow": "scroll",
 "borderRadius": 0,
 "minHeight": 1,
 "scrollBarWidth": 10,
 "propagateClick": true,
 "top": "25%",
 "bottom": "25%",
 "paddingRight": 0,
 "minWidth": 1,
 "verticalAlign": "middle",
 "scrollBarMargin": 2,
 "scrollBarVisible": "rollOver",
 "gap": 0,
 "borderSize": 0,
 "paddingBottom": 0,
 "contentOpaque": false,
 "shadow": false,
 "scrollBarColor": "#000000",
 "paddingTop": 0,
 "data": {
  "name": "-Container buttons"
 },
 "layout": "vertical",
 "paddingLeft": 0,
 "scrollBarOpacity": 0.5
},
{
 "horizontalAlign": "left",
 "children": [
  "this.Container_7DB2F382_7065_343F_41C8_85C6AE9C717F",
  "this.HTMLText_7DB2E382_7065_343F_41C2_951F708170F1",
  "this.IconButton_7DB21382_7065_343F_41B1_484EDBCD16A4"
 ],
 "id": "Container_7DBCC382_7065_343F_41D5_9D3C36B5F479",
 "width": "100%",
 "backgroundOpacity": 0,
 "class": "Container",
 "right": "0%",
 "overflow": "scroll",
 "borderRadius": 0,
 "minHeight": 1,
 "scrollBarWidth": 10,
 "propagateClick": true,
 "scrollBarMargin": 2,
 "bottom": "0%",
 "paddingRight": 0,
 "minWidth": 1,
 "verticalAlign": "bottom",
 "scrollBarVisible": "rollOver",
 "gap": 10,
 "borderSize": 0,
 "paddingBottom": 0,
 "height": "26.316%",
 "contentOpaque": false,
 "shadow": false,
 "scrollBarColor": "#000000",
 "paddingTop": 0,
 "data": {
  "name": "-Container footer"
 },
 "layout": "vertical",
 "paddingLeft": 0,
 "scrollBarOpacity": 0.5
},
{
 "maxHeight": 60,
 "horizontalAlign": "center",
 "id": "IconButton_EF8F8BD8_E386_8E02_41D6_310FF1964329",
 "width": 60,
 "backgroundOpacity": 0,
 "class": "IconButton",
 "maxWidth": 60,
 "borderRadius": 0,
 "minHeight": 1,
 "propagateClick": true,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "minWidth": 1,
 "mode": "toggle",
 "borderSize": 0,
 "pressedIconURL": "skin/IconButton_EF8F8BD8_E386_8E02_41D6_310FF1964329_pressed.png",
 "paddingBottom": 0,
 "height": 60,
 "click": "if(!this.Container_EF8F8BD8_E386_8E02_41E5_90850B5F0BBE.get('visible')){ this.setComponentVisibility(this.Container_EF8F8BD8_E386_8E02_41E5_90850B5F0BBE, true, 0, null, null, false) } else { this.setComponentVisibility(this.Container_EF8F8BD8_E386_8E02_41E5_90850B5F0BBE, false, 0, null, null, false) }",
 "paddingTop": 0,
 "transparencyActive": true,
 "shadow": false,
 "iconURL": "skin/IconButton_EF8F8BD8_E386_8E02_41D6_310FF1964329.png",
 "data": {
  "name": "image button menu"
 },
 "cursor": "hand",
 "paddingLeft": 0
},
{
 "maxHeight": 58,
 "horizontalAlign": "center",
 "id": "IconButton_EE5807F6_E3BE_860E_41E7_431DDDA54BAC",
 "width": 58,
 "backgroundOpacity": 0,
 "class": "IconButton",
 "maxWidth": 58,
 "rollOverIconURL": "skin/IconButton_EE5807F6_E3BE_860E_41E7_431DDDA54BAC_rollover.png",
 "borderRadius": 0,
 "minHeight": 1,
 "propagateClick": true,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "minWidth": 1,
 "mode": "push",
 "borderSize": 0,
 "paddingBottom": 0,
 "height": 58,
 "click": "this.shareTwitter(window.location.href)",
 "paddingTop": 0,
 "transparencyActive": true,
 "shadow": false,
 "iconURL": "skin/IconButton_EE5807F6_E3BE_860E_41E7_431DDDA54BAC.png",
 "visible": false,
 "data": {
  "name": "IconButton TWITTER"
 },
 "cursor": "hand",
 "paddingLeft": 0
},
{
 "maxHeight": 58,
 "horizontalAlign": "center",
 "id": "IconButton_EED5213F_E3B9_7A7D_41D8_1B642C004521",
 "width": 58,
 "backgroundOpacity": 0,
 "class": "IconButton",
 "maxWidth": 58,
 "rollOverIconURL": "skin/IconButton_EED5213F_E3B9_7A7D_41D8_1B642C004521_rollover.png",
 "borderRadius": 0,
 "minHeight": 1,
 "propagateClick": true,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "minWidth": 1,
 "mode": "push",
 "borderSize": 0,
 "paddingBottom": 0,
 "height": 58,
 "click": "this.shareFacebook(window.location.href)",
 "paddingTop": 0,
 "transparencyActive": true,
 "shadow": false,
 "iconURL": "skin/IconButton_EED5213F_E3B9_7A7D_41D8_1B642C004521.png",
 "visible": false,
 "data": {
  "name": "IconButton FB"
 },
 "cursor": "hand",
 "paddingLeft": 0
},
{
 "horizontalAlign": "center",
 "children": [
  "this.Image_062A182F_1140_E20B_41B0_9CB8FFD6AA5A"
 ],
 "height": "100%",
 "id": "Container_062A682F_1140_E20B_41B0_3071FCBF3DC9",
 "width": "85%",
 "backgroundOpacity": 1,
 "class": "Container",
 "overflow": "scroll",
 "borderRadius": 0,
 "minHeight": 1,
 "scrollBarWidth": 10,
 "backgroundColorRatios": [
  0
 ],
 "scrollBarMargin": 2,
 "propagateClick": false,
 "minWidth": 1,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "scrollBarVisible": "rollOver",
 "gap": 10,
 "borderSize": 0,
 "paddingBottom": 0,
 "backgroundColor": [
  "#000000"
 ],
 "paddingTop": 0,
 "contentOpaque": false,
 "shadow": false,
 "scrollBarColor": "#000000",
 "backgroundColorDirection": "vertical",
 "data": {
  "name": "-left"
 },
 "layout": "absolute",
 "paddingLeft": 0,
 "scrollBarOpacity": 0.5
},
{
 "horizontalAlign": "left",
 "children": [
  "this.Container_062A3830_1140_E215_4195_1698933FE51C",
  "this.Container_062A2830_1140_E215_41AA_EB25B7BD381C",
  "this.Container_062AE830_1140_E215_4180_196ED689F4BD"
 ],
 "height": "100%",
 "id": "Container_062A082F_1140_E20A_4193_DF1A4391DC79",
 "width": "50%",
 "backgroundOpacity": 1,
 "class": "Container",
 "overflow": "visible",
 "borderRadius": 0,
 "minHeight": 1,
 "scrollBarWidth": 10,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarMargin": 2,
 "propagateClick": false,
 "minWidth": 460,
 "verticalAlign": "top",
 "paddingRight": 50,
 "scrollBarVisible": "rollOver",
 "gap": 0,
 "borderSize": 0,
 "paddingBottom": 20,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "paddingTop": 20,
 "contentOpaque": false,
 "shadow": false,
 "scrollBarColor": "#0069A3",
 "backgroundColorDirection": "vertical",
 "data": {
  "name": "-right"
 },
 "layout": "vertical",
 "paddingLeft": 50,
 "scrollBarOpacity": 0.51
},
{
 "maxHeight": 60,
 "horizontalAlign": "center",
 "height": "100%",
 "id": "IconButton_062A8830_1140_E215_419D_3439F16CCB3E",
 "width": "7.219%",
 "backgroundOpacity": 0,
 "class": "IconButton",
 "maxWidth": 60,
 "rollOverIconURL": "skin/IconButton_062A8830_1140_E215_419D_3439F16CCB3E_rollover.jpg",
 "borderRadius": 0,
 "minHeight": 50,
 "propagateClick": false,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "minWidth": 50,
 "mode": "push",
 "borderSize": 0,
 "pressedIconURL": "skin/IconButton_062A8830_1140_E215_419D_3439F16CCB3E_pressed.jpg",
 "paddingBottom": 0,
 "iconURL": "skin/IconButton_062A8830_1140_E215_419D_3439F16CCB3E.jpg",
 "click": "this.setComponentVisibility(this.Container_062AB830_1140_E215_41AF_6C9D65345420, false, 0, null, null, false); this.setComponentVisibility(this.Container_7DB20382_7065_343F_4186_6E0B0B3AFF36, false, 0, null, null, false); this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_7FF1F5EF_706F_7FC6_41C7_BCBB555D2D3D, true, 0, null, null, false)",
 "paddingTop": 0,
 "transparencyActive": false,
 "shadow": false,
 "data": {
  "name": "X"
 },
 "cursor": "hand",
 "paddingLeft": 0
},
{
 "horizontalAlign": "left",
 "children": [
  "this.IconButton_38922473_0C06_2593_4199_C585853A1AB3"
 ],
 "id": "Container_3A67552A_0C3A_67BD_4195_ECE46CCB34EA",
 "width": "100%",
 "backgroundOpacity": 0.3,
 "class": "Container",
 "overflow": "scroll",
 "borderRadius": 0,
 "minHeight": 1,
 "scrollBarWidth": 10,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarMargin": 2,
 "propagateClick": false,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "verticalAlign": "top",
 "paddingRight": 0,
 "scrollBarVisible": "rollOver",
 "gap": 10,
 "borderSize": 0,
 "minWidth": 1,
 "paddingBottom": 0,
 "height": 140,
 "paddingTop": 0,
 "contentOpaque": false,
 "shadow": false,
 "scrollBarColor": "#000000",
 "backgroundColorDirection": "vertical",
 "data": {
  "name": "header"
 },
 "layout": "absolute",
 "paddingLeft": 0,
 "scrollBarOpacity": 0.5
},
{
 "paddingLeft": 70,
 "horizontalAlign": "center",
 "itemLabelPosition": "bottom",
 "id": "ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0",
 "left": 0,
 "width": "100%",
 "backgroundOpacity": 0,
 "itemBorderRadius": 0,
 "class": "ThumbnailGrid",
 "selectedItemThumbnailShadowBlurRadius": 16,
 "itemVerticalAlign": "top",
 "itemPaddingLeft": 3,
 "scrollBarMargin": 2,
 "minHeight": 1,
 "scrollBarWidth": 10,
 "propagateClick": false,
 "verticalAlign": "middle",
 "itemMinHeight": 50,
 "itemOpacity": 1,
 "paddingRight": 70,
 "selectedItemThumbnailShadowVerticalLength": 0,
 "minWidth": 1,
 "playList": "this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist",
 "itemThumbnailOpacity": 1,
 "itemMinWidth": 50,
 "height": "92%",
 "itemBackgroundColor": [],
 "itemPaddingTop": 3,
 "borderSize": 0,
 "itemBackgroundColorRatios": [],
 "itemPaddingRight": 3,
 "shadow": false,
 "scrollBarColor": "#04A3E1",
 "itemHeight": 160,
 "itemLabelTextDecoration": "none",
 "itemBackgroundOpacity": 0,
 "selectedItemLabelFontColor": "#04A3E1",
 "itemLabelFontWeight": "normal",
 "scrollBarOpacity": 0.5,
 "rollOverItemThumbnailShadow": true,
 "itemLabelGap": 7,
 "itemLabelFontSize": 16,
 "itemThumbnailHeight": 125,
 "rollOverItemThumbnailShadowBlurRadius": 0,
 "borderRadius": 5,
 "itemThumbnailScaleMode": "fit_outside",
 "scrollBarVisible": "rollOver",
 "itemThumbnailShadow": false,
 "itemBackgroundColorDirection": "vertical",
 "itemLabelFontColor": "#666666",
 "selectedItemThumbnailShadowHorizontalLength": 0,
 "bottom": -0.2,
 "itemThumbnailWidth": 220,
 "rollOverItemThumbnailShadowVerticalLength": 0,
 "itemMaxWidth": 1000,
 "selectedItemThumbnailShadow": true,
 "gap": 26,
 "itemHorizontalAlign": "center",
 "itemPaddingBottom": 3,
 "selectedItemLabelFontWeight": "bold",
 "itemLabelFontStyle": "italic",
 "itemMaxHeight": 1000,
 "paddingBottom": 70,
 "itemWidth": 220,
 "itemMode": "normal",
 "itemLabelHorizontalAlign": "center",
 "paddingTop": 10,
 "data": {
  "name": "ThumbnailList"
 },
 "itemThumbnailBorderRadius": 0,
 "rollOverItemThumbnailShadowHorizontalLength": 8,
 "itemLabelFontFamily": "Oswald",
 "rollOverItemLabelFontColor": "#04A3E1",
 "rollOverItemThumbnailShadowColor": "#04A3E1"
},
{
 "height": "100%",
 "id": "WebFrame_22F9EEFF_0C1A_2293_4165_411D4444EFEA",
 "width": "100%",
 "backgroundOpacity": 1,
 "class": "WebFrame",
 "insetBorder": false,
 "borderRadius": 0,
 "minHeight": 1,
 "url": "https://www.google.com/maps/place/Yayasan+Wangsakerta/@-6.7809146,108.5519752,17.18z/data=!4m10!1m2!2m1!1swangsakerta!3m6!1s0x2e6f1dcc287151b1:0xf21102e967a58453!8m2!3d-6.7811497!4d108.5553819!15sCgt3YW5nc2FrZXJ0YZIBF2FncmljdWx0dXJhbF9wcm9kdWN0aW9u4AEA!16s%2Fg%2F11sf0f1brn?entry=ttu&g_ep=EgoyMDI2MDIwNC4wIKXMDSoKLDEwMDc5MjA3M0gBUAM%3D",
 "backgroundColorRatios": [
  0
 ],
 "propagateClick": false,
 "minWidth": 1,
 "paddingRight": 0,
 "borderSize": 0,
 "paddingBottom": 0,
 "backgroundColor": [
  "#FFFFFF"
 ],
 "paddingTop": 0,
 "scrollEnabled": true,
 "shadow": false,
 "backgroundColorDirection": "vertical",
 "data": {
  "name": "WebFrame48191"
 },
 "paddingLeft": 0
},
{
 "maxHeight": 60,
 "horizontalAlign": "center",
 "height": "75%",
 "id": "IconButton_221B2648_0C06_E5FD_41A6_F9E27CDB95AF",
 "width": "25%",
 "backgroundOpacity": 0,
 "class": "IconButton",
 "maxWidth": 60,
 "rollOverIconURL": "skin/IconButton_221B2648_0C06_E5FD_41A6_F9E27CDB95AF_rollover.jpg",
 "borderRadius": 0,
 "minHeight": 50,
 "propagateClick": false,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "minWidth": 50,
 "mode": "push",
 "borderSize": 0,
 "pressedIconURL": "skin/IconButton_221B2648_0C06_E5FD_41A6_F9E27CDB95AF_pressed.jpg",
 "paddingBottom": 0,
 "iconURL": "skin/IconButton_221B2648_0C06_E5FD_41A6_F9E27CDB95AF.jpg",
 "click": "this.setComponentVisibility(this.Container_221B1648_0C06_E5FD_417F_E6FCCCB4A6D7, false, 0, null, null, false); this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_7FF1F5EF_706F_7FC6_41C7_BCBB555D2D3D, true, 0, null, null, false)",
 "paddingTop": 0,
 "transparencyActive": false,
 "shadow": false,
 "data": {
  "name": "X"
 },
 "cursor": "hand",
 "paddingLeft": 0
},
{
 "horizontalAlign": "left",
 "children": [
  "this.IconButton_2F8A5686_0D4F_6B71_41A1_13CF877A165E"
 ],
 "id": "Container_2F8A7686_0D4F_6B71_41A9_1A894413085C",
 "width": "100%",
 "backgroundOpacity": 0,
 "class": "Container",
 "overflow": "scroll",
 "borderRadius": 0,
 "minHeight": 1,
 "scrollBarWidth": 10,
 "propagateClick": false,
 "scrollBarMargin": 2,
 "paddingRight": 0,
 "minWidth": 1,
 "verticalAlign": "top",
 "scrollBarVisible": "rollOver",
 "gap": 10,
 "borderSize": 0,
 "paddingBottom": 0,
 "height": 140,
 "paddingTop": 0,
 "contentOpaque": false,
 "shadow": false,
 "scrollBarColor": "#000000",
 "data": {
  "name": "header"
 },
 "layout": "absolute",
 "paddingLeft": 0,
 "scrollBarOpacity": 0.5
},
{
 "horizontalAlign": "left",
 "children": [
  "this.ViewerAreaLabeled_2A198C4C_0D3B_DFF0_419F_C9A785406D9C",
  "this.IconButton_2A19BC4C_0D3B_DFF0_419F_D0DCB12FF482",
  "this.IconButton_2A19AC4C_0D3B_DFF0_4181_A2C230C2E510",
  "this.IconButton_2A19CC4C_0D3B_DFF0_41AA_D2AC34177CF1"
 ],
 "height": "100%",
 "id": "Container_2A19EC4C_0D3B_DFF0_414D_37145C22C5BC",
 "width": "100%",
 "backgroundOpacity": 0.3,
 "class": "Container",
 "overflow": "visible",
 "borderRadius": 0,
 "minHeight": 1,
 "scrollBarWidth": 10,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarMargin": 2,
 "propagateClick": false,
 "minWidth": 1,
 "verticalAlign": "top",
 "paddingRight": 0,
 "scrollBarVisible": "rollOver",
 "gap": 10,
 "borderSize": 0,
 "paddingBottom": 0,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "paddingTop": 0,
 "contentOpaque": false,
 "shadow": false,
 "scrollBarColor": "#000000",
 "backgroundColorDirection": "vertical",
 "data": {
  "name": "Container photo"
 },
 "layout": "absolute",
 "paddingLeft": 0,
 "scrollBarOpacity": 0.5
},
{
 "horizontalAlign": "center",
 "children": [
  "this.Image_06C5BBA5_1140_A63F_41A7_E6D01D4CC397"
 ],
 "height": "100%",
 "id": "Container_06C5ABA5_1140_A63F_41A9_850CF958D0DB",
 "width": "55%",
 "backgroundOpacity": 1,
 "class": "Container",
 "overflow": "scroll",
 "borderRadius": 0,
 "minHeight": 1,
 "scrollBarWidth": 10,
 "backgroundColorRatios": [
  0
 ],
 "scrollBarMargin": 2,
 "propagateClick": false,
 "minWidth": 1,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "scrollBarVisible": "rollOver",
 "gap": 10,
 "borderSize": 0,
 "paddingBottom": 0,
 "backgroundColor": [
  "#000000"
 ],
 "paddingTop": 0,
 "contentOpaque": false,
 "shadow": false,
 "scrollBarColor": "#000000",
 "backgroundColorDirection": "vertical",
 "data": {
  "name": "-left"
 },
 "layout": "absolute",
 "paddingLeft": 0,
 "scrollBarOpacity": 0.5
},
{
 "horizontalAlign": "left",
 "children": [
  "this.Container_06C59BA5_1140_A63F_41B1_4B41E3B7D98D",
  "this.Container_06C46BA5_1140_A63F_4151_B5A20B4EA86A",
  "this.Container_06C42BA5_1140_A63F_4195_037A0687532F"
 ],
 "height": "100%",
 "id": "Container_06C58BA5_1140_A63F_419D_EC83F94F8C54",
 "width": "45%",
 "backgroundOpacity": 1,
 "class": "Container",
 "overflow": "visible",
 "borderRadius": 0,
 "minHeight": 1,
 "scrollBarWidth": 10,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarMargin": 2,
 "propagateClick": false,
 "minWidth": 460,
 "verticalAlign": "top",
 "paddingRight": 60,
 "scrollBarVisible": "rollOver",
 "gap": 0,
 "borderSize": 0,
 "paddingBottom": 20,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "paddingTop": 20,
 "contentOpaque": false,
 "shadow": false,
 "scrollBarColor": "#0069A3",
 "backgroundColorDirection": "vertical",
 "data": {
  "name": "-right"
 },
 "layout": "vertical",
 "paddingLeft": 60,
 "scrollBarOpacity": 0.51
},
{
 "maxHeight": 60,
 "horizontalAlign": "center",
 "height": "75%",
 "id": "IconButton_06C40BA5_1140_A63F_41AC_FA560325FD81",
 "width": "25%",
 "backgroundOpacity": 0,
 "class": "IconButton",
 "maxWidth": 60,
 "rollOverIconURL": "skin/IconButton_06C40BA5_1140_A63F_41AC_FA560325FD81_rollover.jpg",
 "borderRadius": 0,
 "minHeight": 50,
 "propagateClick": false,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "minWidth": 50,
 "mode": "push",
 "borderSize": 0,
 "pressedIconURL": "skin/IconButton_06C40BA5_1140_A63F_41AC_FA560325FD81_pressed.jpg",
 "paddingBottom": 0,
 "iconURL": "skin/IconButton_06C40BA5_1140_A63F_41AC_FA560325FD81.jpg",
 "click": "this.setComponentVisibility(this.Container_06C41BA5_1140_A63F_41AE_B0CBD78DEFDC, false, 0, null, null, false); this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_7FF1F5EF_706F_7FC6_41C7_BCBB555D2D3D, true, 0, null, null, false)",
 "paddingTop": 0,
 "transparencyActive": false,
 "shadow": false,
 "data": {
  "name": "X"
 },
 "cursor": "hand",
 "paddingLeft": 0
},
{
 "horizontalAlign": "left",
 "id": "Container_7DB3E382_7065_343F_41C2_E1E6BB5BA055",
 "width": "100%",
 "backgroundOpacity": 0.3,
 "class": "Container",
 "overflow": "scroll",
 "borderRadius": 0,
 "minHeight": 1,
 "scrollBarWidth": 10,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarMargin": 2,
 "propagateClick": true,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "verticalAlign": "top",
 "paddingRight": 0,
 "scrollBarVisible": "rollOver",
 "gap": 10,
 "borderSize": 0,
 "minWidth": 1,
 "paddingBottom": 0,
 "height": 1,
 "paddingTop": 0,
 "contentOpaque": false,
 "shadow": false,
 "scrollBarColor": "#000000",
 "backgroundColorDirection": "vertical",
 "data": {
  "name": "line"
 },
 "layout": "absolute",
 "paddingLeft": 0,
 "scrollBarOpacity": 0.5
},
{
 "textDecoration": "none",
 "layout": "horizontal",
 "fontFamily": "Oswald",
 "horizontalAlign": "left",
 "click": "this.setComponentVisibility(this.Container_062AB830_1140_E215_41AF_6C9D65345420, true, 0, null, null, false); this.setComponentVisibility(this.Container_7DB20382_7065_343F_4186_6E0B0B3AFF36, false, 0, null, null, false)",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "id": "Button_7DB31382_7065_343F_41D6_641BBE1B2562",
 "width": "100%",
 "backgroundOpacity": 0,
 "shadowColor": "#000000",
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "class": "Button",
 "shadowSpread": 1,
 "iconHeight": 32,
 "fontColor": "#FFFFFF",
 "borderRadius": 0,
 "minHeight": 1,
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": true,
 "verticalAlign": "middle",
 "borderColor": "#000000",
 "paddingRight": 0,
 "minWidth": 1,
 "pressedBackgroundOpacity": 1,
 "mode": "push",
 "iconBeforeLabel": true,
 "fontSize": 18,
 "borderSize": 0,
 "paddingBottom": 0,
 "height": 50,
 "label": "Tour Information",
 "fontStyle": "italic",
 "paddingTop": 0,
 "rollOverBackgroundColorRatios": [
  0
 ],
 "gap": 5,
 "shadow": false,
 "iconWidth": 32,
 "rollOverBackgroundOpacity": 0.8,
 "data": {
  "name": "Button Tour Info"
 },
 "fontWeight": "normal",
 "backgroundColorDirection": "vertical",
 "cursor": "hand",
 "paddingLeft": 10,
 "shadowBlurRadius": 6
},
{
 "horizontalAlign": "left",
 "id": "Container_7DB30382_7065_343F_416C_8610BCBA9F50",
 "width": "100%",
 "backgroundOpacity": 0.3,
 "class": "Container",
 "overflow": "scroll",
 "borderRadius": 0,
 "minHeight": 1,
 "scrollBarWidth": 10,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarMargin": 2,
 "propagateClick": true,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "verticalAlign": "top",
 "paddingRight": 0,
 "scrollBarVisible": "rollOver",
 "gap": 10,
 "borderSize": 0,
 "minWidth": 1,
 "paddingBottom": 0,
 "height": 1,
 "paddingTop": 0,
 "contentOpaque": false,
 "shadow": false,
 "scrollBarColor": "#000000",
 "backgroundColorDirection": "vertical",
 "data": {
  "name": "line"
 },
 "layout": "absolute",
 "paddingLeft": 0,
 "scrollBarOpacity": 0.5
},
{
 "textDecoration": "none",
 "layout": "horizontal",
 "fontFamily": "Oswald",
 "horizontalAlign": "left",
 "click": "this.setComponentVisibility(this.Container_7DB20382_7065_343F_4186_6E0B0B3AFF36, false, 0, null, null, false); this.setComponentVisibility(this.Container_39DE87B1_0C06_62AF_417B_8CB0FB5C9D15, true, 0, null, null, false)",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "id": "Button_7DB33382_7065_343F_41B1_0B0F019C1828",
 "width": "100%",
 "backgroundOpacity": 0,
 "shadowColor": "#000000",
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "class": "Button",
 "shadowSpread": 1,
 "iconHeight": 32,
 "fontColor": "#FFFFFF",
 "borderRadius": 0,
 "minHeight": 1,
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": true,
 "verticalAlign": "middle",
 "borderColor": "#000000",
 "paddingRight": 0,
 "minWidth": 1,
 "pressedBackgroundOpacity": 1,
 "mode": "push",
 "iconBeforeLabel": true,
 "fontSize": 18,
 "borderSize": 0,
 "paddingBottom": 0,
 "height": 50,
 "label": "Panorama List",
 "fontStyle": "italic",
 "paddingTop": 0,
 "rollOverBackgroundColorRatios": [
  0
 ],
 "gap": 23,
 "shadow": false,
 "iconWidth": 32,
 "rollOverBackgroundOpacity": 0.8,
 "data": {
  "name": "Button Panorama List"
 },
 "fontWeight": "normal",
 "backgroundColorDirection": "vertical",
 "cursor": "hand",
 "paddingLeft": 10,
 "shadowBlurRadius": 6
},
{
 "horizontalAlign": "left",
 "id": "Container_7DB32382_7065_343F_419E_6594814C420F",
 "width": "100%",
 "backgroundOpacity": 0.3,
 "class": "Container",
 "overflow": "scroll",
 "borderRadius": 0,
 "minHeight": 1,
 "scrollBarWidth": 10,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarMargin": 2,
 "propagateClick": true,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "verticalAlign": "top",
 "paddingRight": 0,
 "scrollBarVisible": "rollOver",
 "gap": 10,
 "borderSize": 0,
 "minWidth": 1,
 "paddingBottom": 0,
 "height": 1,
 "paddingTop": 0,
 "contentOpaque": false,
 "shadow": false,
 "scrollBarColor": "#000000",
 "backgroundColorDirection": "vertical",
 "data": {
  "name": "line"
 },
 "layout": "absolute",
 "paddingLeft": 0,
 "scrollBarOpacity": 0.5
},
{
 "textDecoration": "none",
 "layout": "horizontal",
 "fontFamily": "Oswald",
 "horizontalAlign": "left",
 "click": "this.setComponentVisibility(this.Container_221B1648_0C06_E5FD_417F_E6FCCCB4A6D7, true, 0, null, null, false); this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, false, 0, null, null, false); this.setComponentVisibility(this.Container_7DB20382_7065_343F_4186_6E0B0B3AFF36, false, 0, null, null, false)",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "id": "Button_7DB35382_7065_343F_41C5_CF0EAF3E4CFF",
 "width": "100%",
 "backgroundOpacity": 0,
 "shadowColor": "#000000",
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "class": "Button",
 "shadowSpread": 1,
 "iconHeight": 32,
 "fontColor": "#FFFFFF",
 "borderRadius": 0,
 "minHeight": 1,
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": true,
 "verticalAlign": "middle",
 "borderColor": "#000000",
 "paddingRight": 0,
 "pressedLabel": "Location",
 "minWidth": 1,
 "pressedBackgroundOpacity": 1,
 "mode": "push",
 "iconBeforeLabel": true,
 "fontSize": 18,
 "borderSize": 0,
 "paddingBottom": 0,
 "height": 50,
 "label": "Location",
 "fontStyle": "italic",
 "paddingTop": 0,
 "rollOverBackgroundColorRatios": [
  0
 ],
 "gap": 5,
 "shadow": false,
 "iconWidth": 32,
 "rollOverBackgroundOpacity": 0.8,
 "data": {
  "name": "Button Location"
 },
 "fontWeight": "normal",
 "backgroundColorDirection": "vertical",
 "cursor": "hand",
 "paddingLeft": 10,
 "shadowBlurRadius": 6
},
{
 "horizontalAlign": "left",
 "id": "Container_7DB34382_7065_343F_41CB_A5B96E9749EE",
 "width": "100%",
 "backgroundOpacity": 0.3,
 "class": "Container",
 "overflow": "scroll",
 "borderRadius": 0,
 "minHeight": 1,
 "scrollBarWidth": 10,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarMargin": 2,
 "propagateClick": true,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "verticalAlign": "top",
 "paddingRight": 0,
 "scrollBarVisible": "rollOver",
 "gap": 10,
 "borderSize": 0,
 "minWidth": 1,
 "paddingBottom": 0,
 "height": 1,
 "paddingTop": 0,
 "contentOpaque": false,
 "shadow": false,
 "scrollBarColor": "#000000",
 "backgroundColorDirection": "vertical",
 "data": {
  "name": "line"
 },
 "layout": "absolute",
 "paddingLeft": 0,
 "scrollBarOpacity": 0.5
},
{
 "textDecoration": "none",
 "layout": "horizontal",
 "fontFamily": "Oswald",
 "horizontalAlign": "left",
 "click": "this.setComponentVisibility(this.Container_2F8BB687_0D4F_6B7F_4190_9490D02FBC41, true, 0, null, null, false); this.setComponentVisibility(this.Container_7DB20382_7065_343F_4186_6E0B0B3AFF36, false, 0, null, null, false)",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "id": "Button_7DB37382_7065_343F_41CC_EC41ABCCDE1B",
 "width": "100%",
 "backgroundOpacity": 0,
 "shadowColor": "#000000",
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "class": "Button",
 "shadowSpread": 1,
 "iconHeight": 32,
 "fontColor": "#FFFFFF",
 "borderRadius": 0,
 "minHeight": 1,
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": true,
 "verticalAlign": "middle",
 "borderColor": "#000000",
 "paddingRight": 0,
 "minWidth": 1,
 "pressedBackgroundOpacity": 1,
 "mode": "push",
 "iconBeforeLabel": true,
 "fontSize": 18,
 "borderSize": 0,
 "paddingBottom": 0,
 "height": 50,
 "label": "Floorplan",
 "fontStyle": "italic",
 "paddingTop": 0,
 "rollOverBackgroundColorRatios": [
  0
 ],
 "gap": 5,
 "shadow": false,
 "iconWidth": 32,
 "rollOverBackgroundOpacity": 0.8,
 "data": {
  "name": "Button Floorplan"
 },
 "fontWeight": "normal",
 "backgroundColorDirection": "vertical",
 "cursor": "hand",
 "paddingLeft": 10,
 "shadowBlurRadius": 6
},
{
 "horizontalAlign": "left",
 "id": "Container_7DBC9382_7065_343F_41CC_ED357655BB95",
 "width": "100%",
 "backgroundOpacity": 0.3,
 "class": "Container",
 "overflow": "scroll",
 "borderRadius": 0,
 "minHeight": 1,
 "scrollBarWidth": 10,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarMargin": 2,
 "propagateClick": true,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "verticalAlign": "top",
 "paddingRight": 0,
 "scrollBarVisible": "rollOver",
 "gap": 10,
 "borderSize": 0,
 "minWidth": 1,
 "paddingBottom": 0,
 "height": 1,
 "paddingTop": 0,
 "contentOpaque": false,
 "shadow": false,
 "scrollBarColor": "#000000",
 "backgroundColorDirection": "vertical",
 "data": {
  "name": "line"
 },
 "layout": "absolute",
 "paddingLeft": 0,
 "scrollBarOpacity": 0.5
},
{
 "textDecoration": "none",
 "layout": "horizontal",
 "fontFamily": "Oswald",
 "horizontalAlign": "left",
 "click": "this.setComponentVisibility(this.Container_2A1A5C4D_0D3B_DFF0_41A9_8FC811D03C8E, true, 0, null, null, false); this.setComponentVisibility(this.Container_7DB20382_7065_343F_4186_6E0B0B3AFF36, false, 0, null, null, false)",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "id": "Button_7DBC8382_7065_343F_4183_17B44518DB40",
 "width": "100%",
 "backgroundOpacity": 0,
 "shadowColor": "#000000",
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "class": "Button",
 "shadowSpread": 1,
 "iconHeight": 32,
 "fontColor": "#FFFFFF",
 "borderRadius": 0,
 "minHeight": 1,
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": true,
 "verticalAlign": "middle",
 "borderColor": "#000000",
 "paddingRight": 0,
 "minWidth": 1,
 "pressedBackgroundOpacity": 1,
 "mode": "push",
 "iconBeforeLabel": true,
 "fontSize": 18,
 "borderSize": 0,
 "paddingBottom": 0,
 "height": 50,
 "label": "Photoalbum",
 "fontStyle": "italic",
 "paddingTop": 0,
 "rollOverBackgroundColorRatios": [
  0
 ],
 "gap": 5,
 "shadow": false,
 "iconWidth": 32,
 "rollOverBackgroundOpacity": 0.8,
 "data": {
  "name": "Button Photoalbum"
 },
 "fontWeight": "normal",
 "backgroundColorDirection": "vertical",
 "cursor": "hand",
 "paddingLeft": 10,
 "shadowBlurRadius": 6
},
{
 "horizontalAlign": "left",
 "id": "Container_7DBCB382_7065_343F_41D8_AB382D384291",
 "width": "100%",
 "backgroundOpacity": 0.3,
 "class": "Container",
 "overflow": "scroll",
 "borderRadius": 0,
 "minHeight": 1,
 "scrollBarWidth": 10,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarMargin": 2,
 "propagateClick": true,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "verticalAlign": "top",
 "paddingRight": 0,
 "scrollBarVisible": "rollOver",
 "gap": 10,
 "borderSize": 0,
 "minWidth": 1,
 "paddingBottom": 0,
 "height": 1,
 "paddingTop": 0,
 "contentOpaque": false,
 "shadow": false,
 "scrollBarColor": "#000000",
 "backgroundColorDirection": "vertical",
 "data": {
  "name": "line"
 },
 "layout": "absolute",
 "paddingLeft": 0,
 "scrollBarOpacity": 0.5
},
{
 "textDecoration": "none",
 "layout": "horizontal",
 "fontFamily": "Oswald",
 "horizontalAlign": "left",
 "click": "this.setComponentVisibility(this.Container_06C41BA5_1140_A63F_41AE_B0CBD78DEFDC, true, 0, null, null, false); this.setComponentVisibility(this.Container_7DB20382_7065_343F_4186_6E0B0B3AFF36, false, 0, null, null, false)",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "id": "Button_7DBCA382_7065_343F_41DB_48D975E3D9EC",
 "width": "100%",
 "backgroundOpacity": 0,
 "shadowColor": "#000000",
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "class": "Button",
 "shadowSpread": 1,
 "iconHeight": 32,
 "fontColor": "#FFFFFF",
 "borderRadius": 0,
 "minHeight": 1,
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": true,
 "verticalAlign": "middle",
 "borderColor": "#000000",
 "paddingRight": 0,
 "minWidth": 1,
 "pressedBackgroundOpacity": 1,
 "mode": "push",
 "iconBeforeLabel": true,
 "fontSize": 18,
 "borderSize": 0,
 "paddingBottom": 0,
 "height": 50,
 "label": "Contact Information",
 "fontStyle": "italic",
 "paddingTop": 0,
 "rollOverBackgroundColorRatios": [
  0
 ],
 "gap": 5,
 "shadow": false,
 "iconWidth": 32,
 "rollOverBackgroundOpacity": 0.8,
 "data": {
  "name": "Button Contact"
 },
 "fontWeight": "normal",
 "backgroundColorDirection": "vertical",
 "cursor": "hand",
 "paddingLeft": 10,
 "shadowBlurRadius": 6
},
{
 "horizontalAlign": "left",
 "id": "Container_7DBCD382_7065_343F_41D8_FC14DFF91DA9",
 "width": "100%",
 "backgroundOpacity": 0.3,
 "class": "Container",
 "overflow": "scroll",
 "borderRadius": 0,
 "minHeight": 1,
 "scrollBarWidth": 10,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarMargin": 2,
 "propagateClick": true,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "verticalAlign": "top",
 "paddingRight": 0,
 "scrollBarVisible": "rollOver",
 "gap": 10,
 "borderSize": 0,
 "minWidth": 1,
 "paddingBottom": 0,
 "height": 1,
 "paddingTop": 0,
 "contentOpaque": false,
 "shadow": false,
 "scrollBarColor": "#000000",
 "backgroundColorDirection": "vertical",
 "data": {
  "name": "line"
 },
 "layout": "absolute",
 "paddingLeft": 0,
 "scrollBarOpacity": 0.5
},
{
 "horizontalAlign": "left",
 "id": "Container_7DB2F382_7065_343F_41C8_85C6AE9C717F",
 "width": 40,
 "backgroundOpacity": 1,
 "class": "Container",
 "overflow": "visible",
 "borderRadius": 0,
 "minHeight": 1,
 "scrollBarWidth": 10,
 "backgroundColorRatios": [
  0
 ],
 "scrollBarMargin": 2,
 "propagateClick": true,
 "backgroundColor": [
  "#5CA1DE"
 ],
 "verticalAlign": "top",
 "paddingRight": 0,
 "scrollBarVisible": "rollOver",
 "gap": 10,
 "borderSize": 0,
 "minWidth": 1,
 "paddingBottom": 0,
 "height": 2,
 "paddingTop": 0,
 "contentOpaque": false,
 "shadow": false,
 "scrollBarColor": "#000000",
 "backgroundColorDirection": "vertical",
 "data": {
  "name": "blue line"
 },
 "layout": "horizontal",
 "paddingLeft": 0,
 "scrollBarOpacity": 0.5
},
{
 "id": "HTMLText_7DB2E382_7065_343F_41C2_951F708170F1",
 "width": "100%",
 "backgroundOpacity": 0,
 "class": "HTMLText",
 "borderRadius": 0,
 "minHeight": 1,
 "scrollBarWidth": 10,
 "propagateClick": true,
 "scrollBarMargin": 2,
 "paddingRight": 0,
 "minWidth": 1,
 "scrollBarVisible": "rollOver",
 "borderSize": 0,
 "paddingBottom": 0,
 "height": 78,
 "paddingTop": 0,
 "html": "<div style=\"text-align:left; color:#000; \"><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0px;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#ffffff;font-size:14px;font-family:'Oswald Regular';\"><I>Yayasan Wangsakerta</I></SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0px;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#ffffff;font-size:14px;font-family:'Oswald Regular';\"><I>https://www.yayasanwangsakerta.org</I></SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0px;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#ffffff;font-size:14px;font-family:'Oswald Regular';\"><I>yayasan.wangsakerta@gmail.com</I></SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0px;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#ffffff;font-size:14px;font-family:'Oswald Regular';\"><I>Tlf.: +11 111 111 111</I></SPAN></SPAN></DIV></div>",
 "shadow": false,
 "scrollBarColor": "#000000",
 "data": {
  "name": "HTMLText47602"
 },
 "paddingLeft": 0,
 "scrollBarOpacity": 0.5
},
{
 "maxHeight": 80,
 "horizontalAlign": "center",
 "id": "IconButton_7DB21382_7065_343F_41B1_484EDBCD16A4",
 "width": 42,
 "backgroundOpacity": 0,
 "class": "IconButton",
 "maxWidth": 80,
 "rollOverIconURL": "skin/IconButton_7DB21382_7065_343F_41B1_484EDBCD16A4_rollover.png",
 "borderRadius": 0,
 "minHeight": 1,
 "propagateClick": true,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "minWidth": 1,
 "mode": "push",
 "borderSize": 0,
 "paddingBottom": 0,
 "height": 42,
 "click": "this.setComponentVisibility(this.Container_7DB20382_7065_343F_4186_6E0B0B3AFF36, false, 0, null, null, false); this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_7FF1F5EF_706F_7FC6_41C7_BCBB555D2D3D, true, 0, null, null, false)",
 "paddingTop": 0,
 "transparencyActive": true,
 "shadow": false,
 "iconURL": "skin/IconButton_7DB21382_7065_343F_41B1_484EDBCD16A4.png",
 "data": {
  "name": "IconButton collapse"
 },
 "cursor": "hand",
 "paddingLeft": 0
},
{
 "maxHeight": 1000,
 "horizontalAlign": "center",
 "id": "Image_062A182F_1140_E20B_41B0_9CB8FFD6AA5A",
 "left": "0%",
 "width": "100%",
 "backgroundOpacity": 0,
 "class": "Image",
 "maxWidth": 2000,
 "url": "skin/Image_062A182F_1140_E20B_41B0_9CB8FFD6AA5A.jpg",
 "borderRadius": 0,
 "minHeight": 1,
 "propagateClick": false,
 "top": "0%",
 "paddingRight": 0,
 "minWidth": 1,
 "verticalAlign": "middle",
 "borderSize": 0,
 "paddingBottom": 0,
 "height": "100%",
 "paddingTop": 0,
 "shadow": false,
 "scaleMode": "fit_outside",
 "data": {
  "name": "Image"
 },
 "paddingLeft": 0
},
{
 "horizontalAlign": "right",
 "id": "Container_062A3830_1140_E215_4195_1698933FE51C",
 "width": "100%",
 "backgroundOpacity": 0.3,
 "class": "Container",
 "overflow": "scroll",
 "borderRadius": 0,
 "minHeight": 0,
 "scrollBarWidth": 10,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarMargin": 2,
 "propagateClick": false,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "verticalAlign": "top",
 "paddingRight": 0,
 "scrollBarVisible": "rollOver",
 "gap": 0,
 "borderSize": 0,
 "minWidth": 1,
 "paddingBottom": 0,
 "height": 50,
 "paddingTop": 20,
 "contentOpaque": false,
 "shadow": false,
 "scrollBarColor": "#000000",
 "backgroundColorDirection": "vertical",
 "data": {
  "name": "Container space"
 },
 "layout": "horizontal",
 "paddingLeft": 0,
 "scrollBarOpacity": 0.5
},
{
 "horizontalAlign": "left",
 "children": [
  "this.HTMLText_062AD830_1140_E215_41B0_321699661E7F",
  "this.Button_062AF830_1140_E215_418D_D2FC11B12C47"
 ],
 "height": "100%",
 "id": "Container_062A2830_1140_E215_41AA_EB25B7BD381C",
 "width": "100%",
 "backgroundOpacity": 0.3,
 "class": "Container",
 "overflow": "scroll",
 "borderRadius": 0,
 "minHeight": 300,
 "scrollBarWidth": 10,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarMargin": 2,
 "propagateClick": false,
 "minWidth": 100,
 "verticalAlign": "top",
 "paddingRight": 0,
 "scrollBarVisible": "rollOver",
 "gap": 10,
 "borderSize": 0,
 "paddingBottom": 10,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "paddingTop": 0,
 "contentOpaque": false,
 "shadow": false,
 "scrollBarColor": "#E73B2C",
 "backgroundColorDirection": "vertical",
 "data": {
  "name": "Container text"
 },
 "layout": "vertical",
 "paddingLeft": 0,
 "scrollBarOpacity": 0.79
},
{
 "horizontalAlign": "left",
 "id": "Container_062AE830_1140_E215_4180_196ED689F4BD",
 "width": 370,
 "backgroundOpacity": 0.3,
 "class": "Container",
 "overflow": "scroll",
 "borderRadius": 0,
 "minHeight": 1,
 "scrollBarWidth": 10,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarMargin": 2,
 "propagateClick": false,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "verticalAlign": "top",
 "paddingRight": 0,
 "scrollBarVisible": "rollOver",
 "gap": 10,
 "borderSize": 0,
 "minWidth": 1,
 "paddingBottom": 0,
 "height": 30,
 "paddingTop": 0,
 "contentOpaque": false,
 "shadow": false,
 "scrollBarColor": "#000000",
 "backgroundColorDirection": "vertical",
 "data": {
  "name": "Container space"
 },
 "layout": "horizontal",
 "paddingLeft": 0,
 "scrollBarOpacity": 0.5
},
{
 "maxHeight": 60,
 "horizontalAlign": "right",
 "height": "36.14%",
 "id": "IconButton_38922473_0C06_2593_4199_C585853A1AB3",
 "width": "100%",
 "backgroundOpacity": 0,
 "class": "IconButton",
 "right": 20,
 "maxWidth": 60,
 "rollOverIconURL": "skin/IconButton_38922473_0C06_2593_4199_C585853A1AB3_rollover.jpg",
 "borderRadius": 0,
 "minHeight": 50,
 "propagateClick": false,
 "top": 20,
 "paddingRight": 0,
 "minWidth": 50,
 "verticalAlign": "top",
 "mode": "push",
 "borderSize": 0,
 "pressedIconURL": "skin/IconButton_38922473_0C06_2593_4199_C585853A1AB3_pressed.jpg",
 "paddingBottom": 0,
 "iconURL": "skin/IconButton_38922473_0C06_2593_4199_C585853A1AB3.jpg",
 "click": "this.setComponentVisibility(this.Container_39DE87B1_0C06_62AF_417B_8CB0FB5C9D15, false, 0, null, null, false); this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_7FF1F5EF_706F_7FC6_41C7_BCBB555D2D3D, true, 0, null, null, false)",
 "paddingTop": 0,
 "transparencyActive": false,
 "shadow": false,
 "data": {
  "name": "IconButton X"
 },
 "cursor": "hand",
 "paddingLeft": 0
},
{
 "maxHeight": 60,
 "horizontalAlign": "right",
 "height": "36.14%",
 "id": "IconButton_2F8A5686_0D4F_6B71_41A1_13CF877A165E",
 "width": "100%",
 "backgroundOpacity": 0,
 "class": "IconButton",
 "right": 20,
 "maxWidth": 60,
 "rollOverIconURL": "skin/IconButton_2F8A5686_0D4F_6B71_41A1_13CF877A165E_rollover.jpg",
 "borderRadius": 0,
 "minHeight": 50,
 "propagateClick": false,
 "top": 20,
 "paddingRight": 0,
 "minWidth": 50,
 "verticalAlign": "top",
 "mode": "push",
 "borderSize": 0,
 "pressedIconURL": "skin/IconButton_2F8A5686_0D4F_6B71_41A1_13CF877A165E_pressed.jpg",
 "paddingBottom": 0,
 "iconURL": "skin/IconButton_2F8A5686_0D4F_6B71_41A1_13CF877A165E.jpg",
 "click": "this.setComponentVisibility(this.Container_2F8BB687_0D4F_6B7F_4190_9490D02FBC41, false, 0, null, null, false); this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_7FF1F5EF_706F_7FC6_41C7_BCBB555D2D3D, true, 0, null, null, false)",
 "paddingTop": 0,
 "transparencyActive": false,
 "shadow": false,
 "data": {
  "name": "IconButton X"
 },
 "cursor": "hand",
 "paddingLeft": 0
},
{
 "paddingLeft": 0,
 "id": "ViewerAreaLabeled_2A198C4C_0D3B_DFF0_419F_C9A785406D9C",
 "left": "0%",
 "playbackBarProgressBorderRadius": 0,
 "playbackBarRight": 0,
 "progressBarBorderSize": 0,
 "playbackBarProgressBorderSize": 0,
 "class": "ViewerArea",
 "width": "100%",
 "progressBarBorderRadius": 0,
 "toolTipShadowOpacity": 0,
 "playbackBarBorderRadius": 0,
 "minHeight": 1,
 "playbackBarProgressBorderColor": "#000000",
 "toolTipFontStyle": "normal",
 "toolTipFontFamily": "Georgia",
 "playbackBarHeadBorderColor": "#000000",
 "toolTipTextShadowOpacity": 0,
 "transitionDuration": 500,
 "progressLeft": 0,
 "propagateClick": false,
 "playbackBarHeadBorderSize": 0,
 "playbackBarProgressOpacity": 1,
 "playbackBarHeadBorderRadius": 0,
 "playbackBarBorderSize": 0,
 "paddingRight": 0,
 "minWidth": 1,
 "vrPointerSelectionColor": "#FF6600",
 "playbackBarBackgroundOpacity": 1,
 "borderSize": 0,
 "toolTipFontColor": "#FFFFFF",
 "toolTipBackgroundColor": "#000000",
 "playbackBarHeadShadowColor": "#000000",
 "height": "100%",
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "vrPointerSelectionTime": 2000,
 "progressRight": 0,
 "progressOpacity": 1,
 "shadow": false,
 "progressBarBackgroundColorDirection": "vertical",
 "firstTransitionDuration": 0,
 "progressBottom": 2,
 "progressHeight": 10,
 "playbackBarHeadShadow": true,
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "progressBackgroundOpacity": 1,
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "playbackBarOpacity": 1,
 "toolTipPaddingRight": 10,
 "playbackBarHeadShadowOpacity": 0.7,
 "toolTipBorderSize": 1,
 "toolTipPaddingLeft": 10,
 "toolTipPaddingTop": 7,
 "vrPointerColor": "#FFFFFF",
 "toolTipDisplayTime": 600,
 "progressBarOpacity": 1,
 "transitionMode": "blending",
 "progressBorderSize": 0,
 "playbackBarBorderColor": "#FFFFFF",
 "playbackBarHeadShadowVerticalLength": 0,
 "toolTipBorderRadius": 3,
 "borderRadius": 0,
 "displayTooltipInTouchScreens": true,
 "progressBorderRadius": 0,
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "playbackBarLeft": 0,
 "progressBackgroundColorRatios": [
  0.01
 ],
 "top": "0%",
 "playbackBarHeadShadowBlurRadius": 3,
 "playbackBarHeadHeight": 15,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "progressBarBorderColor": "#0066FF",
 "toolTipBorderColor": "#767676",
 "progressBarBackgroundColorRatios": [
  0
 ],
 "progressBackgroundColorDirection": "vertical",
 "toolTipShadowSpread": 0,
 "toolTipShadowBlurRadius": 3,
 "playbackBarBottom": 0,
 "toolTipTextShadowColor": "#000000",
 "progressBorderColor": "#FFFFFF",
 "playbackBarHeadOpacity": 1,
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "toolTipFontSize": "13px",
 "paddingBottom": 0,
 "toolTipPaddingBottom": 7,
 "toolTipTextShadowBlurRadius": 3,
 "paddingTop": 0,
 "playbackBarHeadShadowHorizontalLength": 0,
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "toolTipShadowColor": "#333333",
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "toolTipOpacity": 0.5,
 "playbackBarHeight": 10,
 "data": {
  "name": "Viewer photoalbum 1"
 },
 "toolTipFontWeight": "normal",
 "playbackBarBackgroundColorDirection": "vertical",
 "playbackBarHeadWidth": 6
},
{
 "maxHeight": 60,
 "horizontalAlign": "center",
 "id": "IconButton_2A19BC4C_0D3B_DFF0_419F_D0DCB12FF482",
 "left": 10,
 "width": "14.22%",
 "backgroundOpacity": 0,
 "class": "IconButton",
 "maxWidth": 60,
 "rollOverIconURL": "skin/IconButton_2A19BC4C_0D3B_DFF0_419F_D0DCB12FF482_rollover.png",
 "borderRadius": 0,
 "minHeight": 50,
 "propagateClick": true,
 "top": "20%",
 "bottom": "20%",
 "paddingRight": 0,
 "minWidth": 50,
 "verticalAlign": "middle",
 "mode": "push",
 "borderSize": 0,
 "pressedIconURL": "skin/IconButton_2A19BC4C_0D3B_DFF0_419F_D0DCB12FF482_pressed.png",
 "paddingBottom": 0,
 "iconURL": "skin/IconButton_2A19BC4C_0D3B_DFF0_419F_D0DCB12FF482.png",
 "paddingTop": 0,
 "transparencyActive": false,
 "shadow": false,
 "data": {
  "name": "IconButton <"
 },
 "cursor": "hand",
 "paddingLeft": 0
},
{
 "maxHeight": 60,
 "horizontalAlign": "center",
 "id": "IconButton_2A19AC4C_0D3B_DFF0_4181_A2C230C2E510",
 "width": "14.22%",
 "backgroundOpacity": 0,
 "class": "IconButton",
 "right": 10,
 "maxWidth": 60,
 "rollOverIconURL": "skin/IconButton_2A19AC4C_0D3B_DFF0_4181_A2C230C2E510_rollover.png",
 "borderRadius": 0,
 "minHeight": 50,
 "propagateClick": true,
 "top": "20%",
 "bottom": "20%",
 "paddingRight": 0,
 "minWidth": 50,
 "verticalAlign": "middle",
 "mode": "push",
 "borderSize": 0,
 "pressedIconURL": "skin/IconButton_2A19AC4C_0D3B_DFF0_4181_A2C230C2E510_pressed.png",
 "iconURL": "skin/IconButton_2A19AC4C_0D3B_DFF0_4181_A2C230C2E510.png",
 "paddingBottom": 0,
 "transparencyActive": false,
 "shadow": false,
 "paddingTop": 0,
 "data": {
  "name": "IconButton >"
 },
 "cursor": "hand",
 "paddingLeft": 0
},
{
 "maxHeight": 60,
 "horizontalAlign": "right",
 "height": "10%",
 "id": "IconButton_2A19CC4C_0D3B_DFF0_41AA_D2AC34177CF1",
 "width": "10%",
 "backgroundOpacity": 0,
 "class": "IconButton",
 "right": 20,
 "maxWidth": 60,
 "rollOverIconURL": "skin/IconButton_2A19CC4C_0D3B_DFF0_41AA_D2AC34177CF1_rollover.jpg",
 "borderRadius": 0,
 "minHeight": 50,
 "propagateClick": true,
 "top": 20,
 "paddingRight": 0,
 "minWidth": 50,
 "verticalAlign": "top",
 "mode": "push",
 "borderSize": 0,
 "pressedIconURL": "skin/IconButton_2A19CC4C_0D3B_DFF0_41AA_D2AC34177CF1_pressed.jpg",
 "paddingBottom": 0,
 "iconURL": "skin/IconButton_2A19CC4C_0D3B_DFF0_41AA_D2AC34177CF1.jpg",
 "click": "this.setComponentVisibility(this.Container_2A1A5C4D_0D3B_DFF0_41A9_8FC811D03C8E, false, 0, null, null, false); this.setComponentVisibility(this.Container_22BB12F4_3075_D173_4184_EC3BC4955417, true, 0, null, null, false); this.setComponentVisibility(this.Container_7FF1F5EF_706F_7FC6_41C7_BCBB555D2D3D, true, 0, null, null, false)",
 "paddingTop": 0,
 "transparencyActive": false,
 "shadow": false,
 "data": {
  "name": "IconButton X"
 },
 "cursor": "hand",
 "paddingLeft": 0
},
{
 "maxHeight": 1000,
 "horizontalAlign": "center",
 "id": "Image_06C5BBA5_1140_A63F_41A7_E6D01D4CC397",
 "left": "0%",
 "width": "100%",
 "backgroundOpacity": 0,
 "class": "Image",
 "maxWidth": 2000,
 "url": "skin/Image_06C5BBA5_1140_A63F_41A7_E6D01D4CC397.jpg",
 "borderRadius": 0,
 "minHeight": 1,
 "propagateClick": false,
 "top": "0%",
 "paddingRight": 0,
 "minWidth": 1,
 "verticalAlign": "bottom",
 "borderSize": 0,
 "paddingBottom": 0,
 "height": "100%",
 "paddingTop": 0,
 "shadow": false,
 "scaleMode": "fit_outside",
 "data": {
  "name": "Image40635"
 },
 "paddingLeft": 0
},
{
 "horizontalAlign": "right",
 "height": "5%",
 "id": "Container_06C59BA5_1140_A63F_41B1_4B41E3B7D98D",
 "width": "100%",
 "backgroundOpacity": 0.3,
 "class": "Container",
 "overflow": "scroll",
 "borderRadius": 0,
 "minHeight": 0,
 "scrollBarWidth": 10,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarMargin": 2,
 "propagateClick": false,
 "minWidth": 1,
 "verticalAlign": "top",
 "paddingRight": 0,
 "scrollBarVisible": "rollOver",
 "gap": 0,
 "borderSize": 0,
 "paddingBottom": 0,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "paddingTop": 20,
 "contentOpaque": false,
 "shadow": false,
 "scrollBarColor": "#000000",
 "backgroundColorDirection": "vertical",
 "data": {
  "name": "Container space"
 },
 "layout": "horizontal",
 "paddingLeft": 0,
 "scrollBarOpacity": 0.5
},
{
 "horizontalAlign": "left",
 "children": [
  "this.HTMLText_0B42C466_11C0_623D_4193_9FAB57A5AC33",
  "this.Container_0D9BF47A_11C0_E215_41A4_A63C8527FF9C"
 ],
 "height": "100%",
 "id": "Container_06C46BA5_1140_A63F_4151_B5A20B4EA86A",
 "width": "100%",
 "backgroundOpacity": 0.3,
 "class": "Container",
 "overflow": "scroll",
 "borderRadius": 0,
 "minHeight": 520,
 "scrollBarWidth": 10,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarMargin": 2,
 "propagateClick": false,
 "minWidth": 100,
 "verticalAlign": "top",
 "paddingRight": 0,
 "scrollBarVisible": "rollOver",
 "gap": 10,
 "borderSize": 0,
 "paddingBottom": 30,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "paddingTop": 0,
 "contentOpaque": false,
 "shadow": false,
 "scrollBarColor": "#E73B2C",
 "backgroundColorDirection": "vertical",
 "data": {
  "name": "Container text"
 },
 "layout": "vertical",
 "paddingLeft": 0,
 "scrollBarOpacity": 0.79
},
{
 "horizontalAlign": "left",
 "id": "Container_06C42BA5_1140_A63F_4195_037A0687532F",
 "width": 370,
 "backgroundOpacity": 0.3,
 "class": "Container",
 "overflow": "scroll",
 "borderRadius": 0,
 "minHeight": 1,
 "scrollBarWidth": 10,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarMargin": 2,
 "propagateClick": false,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "verticalAlign": "top",
 "paddingRight": 0,
 "scrollBarVisible": "rollOver",
 "gap": 10,
 "borderSize": 0,
 "minWidth": 1,
 "paddingBottom": 0,
 "height": 40,
 "paddingTop": 0,
 "contentOpaque": false,
 "shadow": false,
 "scrollBarColor": "#000000",
 "backgroundColorDirection": "vertical",
 "data": {
  "name": "Container space"
 },
 "layout": "horizontal",
 "paddingLeft": 0,
 "scrollBarOpacity": 0.5
},
{
 "id": "HTMLText_062AD830_1140_E215_41B0_321699661E7F",
 "width": "100%",
 "backgroundOpacity": 0,
 "class": "HTMLText",
 "borderRadius": 0,
 "minHeight": 1,
 "scrollBarWidth": 10,
 "propagateClick": false,
 "scrollBarMargin": 2,
 "paddingRight": 10,
 "minWidth": 1,
 "scrollBarVisible": "rollOver",
 "borderSize": 0,
 "paddingBottom": 20,
 "height": "100%",
 "paddingTop": 0,
 "html": "<div style=\"text-align:left; color:#000; \"><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#04a3e1;font-size:8.24vh;font-family:'Bebas Neue Bold';\">___</SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:4.71vh;font-family:'Oswald';\"><B><I>YAYASAN WANGSAKERTA</I></B></SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#04a3e1;font-size:2.02vh;font-family:'Oswald';\"><B>Mewujudkan masyarakat yang cukup pangan, cukup energi, cukup informasi, dan mampu menentukan diri sendiri</B></SPAN></SPAN></DIV><p STYLE=\"margin:0; line-height:1.18vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.18vh;font-family:Arial, Helvetica, sans-serif;\"/></p><p STYLE=\"margin:0; line-height:1.18vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.18vh;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:center;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:2.02vh;\"><B>Visi</B></SPAN></SPAN></DIV><p STYLE=\"margin:0; line-height:1.18vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.18vh;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:center;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.18vh;font-family:Arial, Helvetica, sans-serif;\"><B> </B>Wangsakerta merupakan sekelompok orang pembelajar yang peduli masalah - masalah sosial, meyakini dan memegang nilai-nilai kejujuran, kerja keras dan tanggungjawab untuk mewujudkan masyarakat yang cukup pangan,cukup energi, cukup informasi, mampu menentukan diri sendiri dan diridhoi oleh Allah SWT.</SPAN></DIV><p STYLE=\"margin:0; line-height:1.18vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.18vh;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:center;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:2.02vh;\"><B>Misi</B></SPAN></SPAN></DIV><p STYLE=\"margin:0; line-height:2.02vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.18vh;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:center;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.18vh;font-family:Arial, Helvetica, sans-serif;\">Membangun kesadaran masyarakat mengenai jati diri dan potensi sumberdaya yang mereka miliki</SPAN></DIV><DIV STYLE=\"text-align:center;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.18vh;font-family:Arial, Helvetica, sans-serif;\">Menghasilkan pengetahuan berbasis kearifan lokal yang berguna bagi kehidupan dan kemanusiaan</SPAN></DIV><DIV STYLE=\"text-align:center;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.18vh;font-family:Arial, Helvetica, sans-serif;\">Membangun kapasitas kelompok-kelompok masyarakat dalam mengakses informasi pada kemajuan ilmu pengetahuan dan teknologi serta mampu memanfaatkannya untuk kemashlahatan bersama</SPAN></DIV><p STYLE=\"margin:0; line-height:1.18vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.18vh;font-family:Arial, Helvetica, sans-serif;\"/></p><p STYLE=\"margin:0; line-height:1.18vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.18vh;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.18vh;font-family:Arial, Helvetica, sans-serif;\"><B>STRATEGI UMUM</B></SPAN></DIV><p STYLE=\"margin:0; line-height:1.18vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.18vh;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.18vh;font-family:Arial, Helvetica, sans-serif;\">Membuat baseline data dan informasi kawasan Ciayumajakuning terutama terkait:</SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.18vh;font-family:Arial, Helvetica, sans-serif;\"> - Pangan dan sumber-sumber pangan</SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.18vh;font-family:Arial, Helvetica, sans-serif;\"> - Energi dan sumber-sumber energi</SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.18vh;font-family:Arial, Helvetica, sans-serif;\"> - Air dan sumber-sumber air</SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.18vh;font-family:Arial, Helvetica, sans-serif;\"> - Situs-situs sejarah dan budaya lokal</SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.18vh;font-family:Arial, Helvetica, sans-serif;\"> - Pranata kelembagaan lokal dan jaringan komunitas Adat</SPAN></DIV><p STYLE=\"margin:0; line-height:1.18vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.18vh;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.18vh;font-family:Arial, Helvetica, sans-serif;\">Merintis kegiatan-kegiatan percontohan untuk meningkatkan penghidupan melalui kelompok anak-anak muda:</SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.18vh;font-family:Arial, Helvetica, sans-serif;\"> - Pertanian</SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.18vh;font-family:Arial, Helvetica, sans-serif;\"> - Energi alternatif</SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.18vh;font-family:Arial, Helvetica, sans-serif;\"> - Peternakan</SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.18vh;font-family:Arial, Helvetica, sans-serif;\"> - Pengelolaan sanitasi dan kesehatan lingkungan</SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.18vh;font-family:Arial, Helvetica, sans-serif;\"> - Pengelolaan sumber-sumber daya air</SPAN></DIV><p STYLE=\"margin:0; line-height:1.18vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.18vh;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.18vh;font-family:Arial, Helvetica, sans-serif;\">Menggiatkan gerakan pendidikan transformatif dari kalangan kelompok anak-anak muda terkait:</SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.18vh;font-family:Arial, Helvetica, sans-serif;\"> - Teknologi tepat guna</SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.18vh;font-family:Arial, Helvetica, sans-serif;\"> - Kesadaran lingkungan</SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.18vh;font-family:Arial, Helvetica, sans-serif;\"> - Organisasi dan kepemimpinan</SPAN></DIV><p STYLE=\"margin:0; line-height:1.18vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.18vh;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.18vh;font-family:Arial, Helvetica, sans-serif;\">Menata kembali tata ruang Desa, kepemerintahan desa, dan Kawasan:</SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.18vh;font-family:Arial, Helvetica, sans-serif;\"> - Sistem Informasi Desa</SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.18vh;font-family:Arial, Helvetica, sans-serif;\"> - Koperasi Desa</SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.18vh;font-family:Arial, Helvetica, sans-serif;\"> - Kerjasama antar kawasan (desa-desa)</SPAN></DIV><p STYLE=\"margin:0; line-height:2.69vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.18vh;font-family:Arial, Helvetica, sans-serif;\"/></p></div>",
 "shadow": false,
 "scrollBarColor": "#04A3E1",
 "data": {
  "name": "HTMLText"
 },
 "paddingLeft": 10,
 "scrollBarOpacity": 0.5
},
{
 "textDecoration": "none",
 "layout": "horizontal",
 "fontFamily": "Oswald",
 "horizontalAlign": "center",
 "id": "Button_062AF830_1140_E215_418D_D2FC11B12C47",
 "width": 180,
 "backgroundOpacity": 0.7,
 "shadowColor": "#000000",
 "class": "Button",
 "shadowSpread": 1,
 "iconHeight": 32,
 "fontColor": "#FFFFFF",
 "minHeight": 1,
 "borderRadius": 50,
 "backgroundColorRatios": [
  0
 ],
 "propagateClick": false,
 "verticalAlign": "middle",
 "borderColor": "#000000",
 "paddingRight": 0,
 "backgroundColor": [
  "#04A3E1"
 ],
 "pressedBackgroundOpacity": 1,
 "mode": "push",
 "iconBeforeLabel": true,
 "fontSize": "2.39vh",
 "label": "LOREM IPSUM",
 "borderSize": 0,
 "minWidth": 1,
 "paddingBottom": 0,
 "height": 50,
 "gap": 5,
 "fontStyle": "italic",
 "paddingTop": 0,
 "pressedBackgroundColor": [
  "#000000"
 ],
 "shadow": false,
 "iconWidth": 32,
 "rollOverBackgroundOpacity": 1,
 "backgroundColorDirection": "vertical",
 "data": {
  "name": "Button31015"
 },
 "fontWeight": "bold",
 "pressedBackgroundColorRatios": [
  0
 ],
 "cursor": "hand",
 "paddingLeft": 0,
 "shadowBlurRadius": 6
},
{
 "id": "HTMLText_0B42C466_11C0_623D_4193_9FAB57A5AC33",
 "width": "100%",
 "backgroundOpacity": 0,
 "class": "HTMLText",
 "borderRadius": 0,
 "minHeight": 1,
 "scrollBarWidth": 10,
 "propagateClick": false,
 "scrollBarMargin": 2,
 "paddingRight": 0,
 "minWidth": 1,
 "scrollBarVisible": "rollOver",
 "borderSize": 0,
 "paddingBottom": 10,
 "height": "46%",
 "paddingTop": 0,
 "html": "<div style=\"text-align:left; color:#000; \"><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#04a3e1;font-size:8.24vh;font-family:'Bebas Neue Bold';\">___</SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:4.71vh;font-family:'Oswald';\"><B><I>Licensed</I></B></SPAN></SPAN></DIV></div>",
 "shadow": false,
 "scrollBarColor": "#04A3E1",
 "data": {
  "name": "HTMLText18899"
 },
 "paddingLeft": 0,
 "scrollBarOpacity": 0
},
{
 "horizontalAlign": "left",
 "children": [
  "this.Image_0B48D65D_11C0_6E0F_41A2_4D6F373BABA0",
  "this.HTMLText_0B4B0DC1_11C0_6277_41A4_201A5BB3F7AE"
 ],
 "height": "75%",
 "id": "Container_0D9BF47A_11C0_E215_41A4_A63C8527FF9C",
 "width": "100%",
 "backgroundOpacity": 0.3,
 "class": "Container",
 "overflow": "scroll",
 "borderRadius": 0,
 "minHeight": 1,
 "scrollBarWidth": 10,
 "backgroundColorRatios": [
  0,
  1
 ],
 "scrollBarMargin": 2,
 "propagateClick": false,
 "minWidth": 1,
 "verticalAlign": "top",
 "paddingRight": 0,
 "scrollBarVisible": "rollOver",
 "gap": 10,
 "borderSize": 0,
 "paddingBottom": 0,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "paddingTop": 0,
 "contentOpaque": false,
 "shadow": false,
 "scrollBarColor": "#000000",
 "backgroundColorDirection": "vertical",
 "data": {
  "name": "- content"
 },
 "layout": "horizontal",
 "paddingLeft": 0,
 "scrollBarOpacity": 0.5
},
{
 "maxHeight": 200,
 "horizontalAlign": "left",
 "id": "Image_0B48D65D_11C0_6E0F_41A2_4D6F373BABA0",
 "width": "22.647%",
 "backgroundOpacity": 0,
 "class": "Image",
 "maxWidth": 200,
 "url": "skin/Image_0B48D65D_11C0_6E0F_41A2_4D6F373BABA0.jpg",
 "borderRadius": 0,
 "minHeight": 1,
 "propagateClick": false,
 "verticalAlign": "top",
 "paddingRight": 0,
 "minWidth": 1,
 "borderSize": 0,
 "paddingBottom": 0,
 "height": "35.453%",
 "paddingTop": 0,
 "shadow": false,
 "scaleMode": "fit_inside",
 "data": {
  "name": "agent photo"
 },
 "paddingLeft": 0
},
{
 "id": "HTMLText_0B4B0DC1_11C0_6277_41A4_201A5BB3F7AE",
 "width": "74.412%",
 "backgroundOpacity": 0,
 "class": "HTMLText",
 "borderRadius": 0,
 "minHeight": 1,
 "scrollBarWidth": 10,
 "propagateClick": false,
 "scrollBarMargin": 2,
 "paddingRight": 10,
 "minWidth": 1,
 "scrollBarVisible": "rollOver",
 "borderSize": 0,
 "paddingBottom": 10,
 "height": "56.493%",
 "paddingTop": 0,
 "html": "<div style=\"text-align:left; color:#000; \"><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#04a3e1;font-size:2.02vh;font-family:'Oswald';\"><B><I>Nurul Hidayah</I></B></SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:2.02vh;font-family:'Oswald';\"><I>Licensed Real Estate Salesperson</I></SPAN></SPAN></DIV><p STYLE=\"margin:0; line-height:1.85vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.18vh;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#999999;font-size:1.85vh;font-family:'Oswald';\"><I>Tlf.: +62 82130861768</I></SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#999999;font-size:1.85vh;font-family:'Oswald';\"><I>nurulhidayah.ac@gmail.com</I></SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#999999;font-size:1.85vh;font-family:'Oswald';\"><I>www.loremipsum.com</I></SPAN></SPAN></DIV><p STYLE=\"margin:0; line-height:1.18vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.18vh;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-size:1.18vh;font-family:Arial, Helvetica, sans-serif;\">Mauris aliquet neque quis libero consequat vestibulum. Donec lacinia consequat dolor viverra sagittis. Praesent consequat porttitor risus, eu condimentum nunc. Proin et velit ac sapien luctus efficitur egestas ac augue. Nunc dictum, augue eget eleifend interdum, quam libero imperdiet lectus, vel scelerisque turpis lectus vel ligula. Duis a porta sem. Maecenas sollicitudin nunc id risus fringilla, a pharetra orci iaculis. Aliquam turpis ligula, tincidunt sit amet consequat ac, imperdiet non dolor.</SPAN></DIV></div>",
 "shadow": false,
 "scrollBarColor": "#04A3E1",
 "data": {
  "name": "HTMLText19460"
 },
 "paddingLeft": 10,
 "scrollBarOpacity": 0.5
}],
 "scrollBarMargin": 2,
 "propagateClick": true,
 "minWidth": 20,
 "vrPolyfillScale": 0.5,
 "verticalAlign": "top",
 "paddingRight": 0,
 "mobileMipmappingEnabled": false,
 "desktopMipmappingEnabled": false,
 "scrollBarVisible": "rollOver",
 "backgroundPreloadEnabled": true,
 "borderSize": 0,
 "paddingBottom": 0,
 "gap": 10,
 "paddingTop": 0,
 "buttonToggleMute": "this.IconButton_EED073D3_E38A_9E06_41E1_6CCC9722545D",
 "contentOpaque": false,
 "shadow": false,
 "buttonToggleFullscreen": "this.IconButton_EEFF957A_E389_9A06_41E1_2AD21904F8C0",
 "scrollBarColor": "#000000",
 "defaultVRPointer": "laser",
 "data": {
  "name": "Player468"
 },
 "downloadEnabled": true,
 "layout": "absolute",
 "paddingLeft": 0,
 "scrollBarOpacity": 0.5
};

    
    function HistoryData(playList) {
        this.playList = playList;
        this.list = [];
        this.pointer = -1;
    }

    HistoryData.prototype.add = function(index){
        if(this.pointer < this.list.length && this.list[this.pointer] == index) {
            return;
        }
        ++this.pointer;
        this.list.splice(this.pointer, this.list.length - this.pointer, index);
    };

    HistoryData.prototype.back = function(){
        if(!this.canBack()) return;
        this.playList.set('selectedIndex', this.list[--this.pointer]);
    };

    HistoryData.prototype.forward = function(){
        if(!this.canForward()) return;
        this.playList.set('selectedIndex', this.list[++this.pointer]);
    };

    HistoryData.prototype.canBack = function(){
        return this.pointer > 0;
    };

    HistoryData.prototype.canForward = function(){
        return this.pointer >= 0 && this.pointer < this.list.length-1;
    };
    //

    if(script.data == undefined)
        script.data = {};
    script.data["history"] = {};    //playListID -> HistoryData

    TDV.PlayerAPI.defineScript(script);
})();
