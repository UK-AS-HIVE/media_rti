/*************************************************************************/
/*                                                                       */
/*  WebMultiRes                                                          */
/*  JavaScript 3D Graphics Library on top of SpiderGL for web            */
/*  visualization of high resolution RTI images                          */
/*                                                                       */
/*  Copyright (C) 2013                                                   */
/*  Gianpaolo Palma                                                      */
/*  Visual Computing Laboratory                                          */
/*  ISTI - Italian National Research Council (CNR)                       */
/*  http://vcg.isti.cnr.it                                               */
/*  mailto: gianpaolo[DOT]palma[AT]isti[DOT]cnr[DOT]it                   */
/*                                                                       */
/*                                                                       */
/*  This program is free software: you can redistribute it and/or modify */
/*  it under the terms of the GNU General Public License as published by */
/*  the Free Software Foundation, either version 3 of the License, or    */
/*  (at your option) any later version.                                  */
/*                                                                       */
/*  This program is distributed in the hope that it will be useful,      */
/*  but WITHOUT ANY WARRANTY; without even the implied warranty of       */
/*  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the        */
/*  GNU General Public License for more details.                         */
/*                                                                       */
/*  You should have received a copy of the GNU General Public License    */
/*  along with this program.  If not, see <http://www.gnu.org/licenses/> */
/*************************************************************************/

var $ = jQuery;

function createRtiViewer(e, t, n, r) {
    var i = $($("#" + e)[0]);
    var s = document.createElement("div");
    s.id = e + "_div";
    s.style.height = r + "px";
    s.style.width = n + "px";
    s.style.margin = "auto";
    s.style.position = "relative";
    i.append(s);
    var o = $($("#" + e + "_div")[0]);
    var u = e + "_webgl";
    var a = document.createElement("canvas");
    a.id = u;
    a.width = n;
    a.height = r;
    o.append(a);
    /*var f = document.createElement("a");
    f.href = "http://vcg.isti.cnr.it";
    f.target = "_blank";
    var l = document.createElement("div");
    l.style.width = 80 + "px";
    l.style.height = 50 + "px";
    f.appendChild(l);
    f.style.position = "absolute";
    f.style.bottom = "0px";
    f.style.left = "0px";
    f.style.cssFloat = "left";
    o.append(f);*/
    var c = document.createElement("div");
    c.setAttribute("class", "toolbar");
    c.style.position = "absolute";
    c.style.top = "10px";
    c.style.left = "10px";
    c.style.cssFloat = "left";
    c.style.width = "40px";
    c.style.height = "200px";
    c.innerHTML = '<button class = "toolbarButton zoomIn"></button><button class = "toolbarButton zoomOut"></button><button class = "toolbarButton light"></button><button class = "toolbarButton help"></button><div class="specularSliders"><div class="specularBlendSlider"></div><div class="specularExponentSlider"></div></div>';
    o.append(c);
    var h = document.createElement("div");
    h.id = e + "_guide";
    h.style.width = "100%";
    h.style.height = "100%";
    h.style.position = "absolute";
    h.style.left = "0px";
    h.style.top = "0px";
    h.style.color = "#FFFFFF";
    h.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
    h.style.zIndex = 500;
    h.innerHTML = '<div style = "display:table; width: 100%; height: 100%; font-size: 14px; font-family: Verdana,sans-serif;"><div style ="display: table-cell; width: 100%; vertical-align: middle; text-align: left;"> <div style ="width: 70%; margin: auto;"><h3>RTI Viewer<br/></h3><p>This viewer allows dynamically relighting objects through Reflectance Transformation Imaging.</p><ul><li>To change the lighting direction, toggle the light control on, then click and drag around the viewer.</li><li>Use the sliders to adjust the blend and falloff of specular highlighting to enhance visibility of certain artifacts.</li></ul></div></div></div>';
    h.style.display = "none";
    o.append(h);
    $("#" + e + "_div .zoomIn").button({
        icons: {
            primary: "zoomInIcon toolbarIcon"
        },
        text: false
    }).click(function() {
        d.startZoomIn()
    });
    $("#" + e + "_div .zoomOut").button({
        icons: {
            primary: "zoomOutIcon toolbarIcon"
        },
        text: false
    }).click(function() {
        d.startZoomOut()
    });
    $("#" + e + "_div .light").button({
        icons: {
            primary: "lightIcon toolbarIcon"
        },
        text: false,
        label: "Light Off"
    }).click(function() {
        var e;
        if ($(this).text() == "Light Off") {
            e = {
                label: "Light On",
                icons: {
                    primary: "lightOnIcon toolbarIcon"
                }
            };
            d.setMode(1)
        } else {
            e = {
                label: "Light Off",
                icons: {
                    primary: "lightIcon toolbarIcon"
                }
            };
            d.setMode(0)
        }
        $(this).button("option", e)
    });
    $("#" + e + "_div .help").button({
        icons: {
            primary: "helpIcon toolbarIcon"
        },
        text: false
    }).click(function() {
        $("#" + e + "_guide").show()
    });
    $("#" + e + "_div .specularBlendSlider").slider({
       orientation: 'horizontal',
       min: 0,
       max: 1000,
       value: 500,
       slide: function(e, o) {
         d.renderer.specularBlend = o.value/1000.0;
       }
    });
    $("#" + e + "_div .specularExponentSlider").slider({
       orientation: 'horizontal',
       min: 10,
       max: 500,
       value: 250,
       slide: function(e, o) {
         d.renderer.specularExponent = o.value;
       }
    });
    $("#" + e + "_guide").click(function() {
        $("#" + e + "_guide").hide()
    });
    var p = document.createElement("div");
    p.id = e + "_error";
    p.style.width = "100%";
    p.style.height = "100%";
    p.style.position = "absolute";
    p.style.left = "0px";
    p.style.top = "0px";
    p.style.color = "#FFFFFF";
    p.style.backgroundColor = "rgba(0, 0, 0, 1.0)";
    p.style.zIndex = 500;
    p.innerHTML = '<canvas id = "testCanvas" width= "800" height= "600" contenteditable="true"></canvas>';
    p.style.display = "none";
    o.append(p);
    if (sglGetCanvasContext("testCanvas") == null) {
        p.style.display = "block";
        p.innerHTML = '<div id = "contentError" style = "width: 90%; height: 100%; text-align:left; padding:0% 5% 0% 5%; font-family:  Verdana,sans-serif; overflow-y: scroll;"><h3>WebGL is not available or not enabled.</h3><p><a href="http://en.wikipedia.org/wiki/WebGL">WebGL</a> is the technology we use to display the RTI images. It is currently supported, but sometimes not enabled by default, by recent versions of <a href="http://www.mozilla.org/firefox">Firefox</a>, <a href="http://www.google.com/chrome">Chrome</a> and <a href="http://www.apple.com/safari">Safari</a>. An external plugins is available for <a href="http://microsoft.com/ie">Internet  Explorer</a>.<br/> It also requires a moderately recent and capable hardware and up to date drivers.</p><p><b>Chrome</b><br/>Type "chrome://flags" in the address bar.<br/>Disable (yes, it is a confusing double negation!) the WebGL entry.<br/>Click the <em>relaunch now</em> button at the bottom.</p><p><b>Firefox</b><br/>Type "about:config" in the address bar<br/>Type "webgl" in the <em>Filter</em>.<br/>Doubleclick the entry <b>webgl.force-enable</b>, and restart Firefox.</p><p><b>Safari</b><br/>Open the Safari menu and select Preferences.<br/>Then, click the Advanced tab in the Preferences window.<br/>Then, at the bottom of the window, check the Show Develop menu in menu bar checkbox.<br/>Then, open the Develop menu in the menu bar and select Enable WebGL.</p><p><b>Internet Explorer (from version 9.0)</b><br/>Install the <a href="http://www.google.com/chromeframe">Chrome Frame</a> <br/>Open the Tools menu and select Manage add-ons.<br/>Then, enable the ChromeFrame BHO plugins and restart Internet Explorer.<br/></p><p><b>Installing updated drivers</b><br/>If the visualization of the RTI image fails you must update the drivers of your graphics cards.</p></div>'
    } else {
        p.innerHTML = "";
        var d = new MultiRes(u);
        d.setImageUrl(t);
        sglRegisterCanvas(u, d, 10)
    }
}

function log(e) {}

function MultiRes(e) {
    this.mode = 0;
    this.stepAnimation = 0;
    this.idTimer;
    this.flipAngles = [];
    this.flipAngles[0] = 0;
    this.canvas = e;
    this.rendering = false;
    this.onDrawCallback = null;
    this.animating = false;
    this.moveToCenter = false;
    this.imageUrl = "";
    this.currentSpeed = 0;
    this.maxStep = 7;
    this.animationStack = [];
    this.isMoving = false;
    for (var t = 1; t < 21; t++) this.flipAngles[t] = SGL_PI / 2 * Math.sin(t / 40 * SGL_PI)
}

function MultiResNode() {
    this.id = 0;
    this.parentIndex = -1;
    this.childrenIndices = [-1, -1, -1, -1];
    this.projectedSize = 1;
    this.zScale = 1;
    this.box = new SglBox3;
    this.priority = {
        timestamp: -1,
        error: Number.MAX_VALUE
    };
    this.req = null;
    this.data = null;
    this.isLeaf = true
}

function MultiResTree(e, t) {
    this.ready = true;
    this.nodesCount = 0;
    this.rootIndex = -1;
    this.nodes = null;
    this.url = null;
    this.tileSize = 0;
    this.scale = [1, 1, 1];
    this.offset = [0, 0, 0];
    if (e) this.load(e, t)
}

function _MultiResAssert(e) {
    if (e) return;
    alert("MultiResAssert FAILED : " + e)
}

function _MultiResCompareNodes(e, t) {
    if (e.priority.timestamp != t.priority.timestamp) return t.priority.timestamp - e.priority.timestamp;
    if (e.priority.error != t.priority.error) return t.priority.error - e.priority.error;
    return e.id - t.id
}

function MultiResRenderer(e, t, n) {
    this.gl = e;
    this._tree = new MultiResTree;
    this._timestamp = 0;
    this._frustum = new SglFrustum;
    this._maxError = 1;
    this._cache = [];
    this._cacheSizeInBytes = t;
    this._maxCacheSize = 1;
    this._maxOngoingRequests = 2;
    this._currentOngoingRequests = 0;
    this._toRequest = [];
    this._toRenderFullRes = [];
    this._toRenderHalfRes = [];
    this._readyItems = [];
    this.renderData = true;
    this.renderBoxes = false;
    var r = new Float32Array([-.5, -.5, .5, .5, -.5, .5, -.5, .5, .5, .5, .5, .5, -.5, -.5, -.5, .5, -.5, -.5, -.5, .5, -.5, .5, .5, -.5]);
    var i = new Uint16Array([0, 1, 2, 2, 1, 3, 5, 4, 7, 7, 4, 6, 4, 0, 6, 6, 0, 2, 1, 5, 3, 3, 5, 7, 2, 3, 6, 6, 3, 7, 4, 5, 0, 0, 5, 1]);
    var s = new Uint16Array([0, 1, 1, 3, 3, 2, 2, 0, 5, 4, 4, 6, 6, 7, 7, 5, 0, 4, 1, 5, 3, 7, 2, 6]);
    var o = new SglMeshGL(e);
    o.addVertexAttribute("position", 3, r);
    o.addIndexedPrimitives("triangles", e.TRIANGLES, i);
    o.addIndexedPrimitives("edges", e.LINES, s);
    this._boxMesh = o;
    this._tileFullMesh = null;
    this._tileHalfMesh = null;
    this._program = null;
    var u = sglLoadFile("/sites/all/modules/media_rti/js/spidergl/box.v.glsl");
    var a = sglLoadFile("/sites/all/modules/media_rti/js/spidergl/box.f.glsl");
    var f = new SglProgram(e, [u], [a]);
    log(f.log);
    this._boxProgram = f;
    this._boxRenderer = new SglMeshGLRenderer(this._boxProgram);
    this._treeTransform = sglIdentityM4();
    this._normalizedTreeTransform = sglIdentityM4();
    this.updateData = true;
    var l = "#ifdef GL_ES\n" + "precision highp float;\n" + "#endif\n" + "uniform   mat4 u_mvp;\n" + "attribute vec2 a_position;\n" + "attribute vec2 a_texcoord;\n" + "varying   vec2 v_texcoord;\n" + "void main(void){\n" + "v_texcoord  = a_texcoord;\n" + "gl_Position = u_mvp * vec4(a_position, 0.0, 1.0);\n}";
    var c = "#ifdef GL_ES\n" + "precision highp float;\n" + "#endif\n" + "uniform sampler2D s_texture;\n" + "varying vec2     v_texcoord;\n" + "void main(void){" + "vec4 color = texture2D(s_texture, v_texcoord).xyzw;\n" + "if (color.w > 0.7)\n" + "gl_FragData[0] = vec4(color.rgb, 1.0);\n" + "else\n" + "gl_FragData[0] = vec4(0.0);}";
    this.texProg = new SglProgram(this.gl, [l], [c]);
    log(this.texProg.log);
    var h = new Float32Array([0, 0, 80, 0, 0, 50, 80, 50]);
    var p = new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]);
    var d = new SglMeshGL(this.gl);
    d.addVertexAttribute("position", 2, h);
    d.addVertexAttribute("texcoord", 2, p);
    d.addArrayPrimitives("tristrip", this.gl.TRIANGLE_STRIP, 0, 4);
    this.lgMesh = d;
    this._createLg();
    this.enumType = new Object;
    this.enumType["HSH_RTI"] = 1;
    this.enumType["LRGB_PTM"] = 2;
    this.enumType["RGB_PTM"] = 3;
    this.enumType["IMAGE"] = 4
}
MultiRes.prototype = {
    setMode: function(e) {
        this.mode = e
    },
    _setLightDir: function(e, t) {
        var n = e / this.ui.width * 2.2 - 1.1;
        var r = t / this.ui.height * 2.2 - 1.1;
        n = Math.min(1, Math.max(-1, n));
        r = Math.min(1, Math.max(-1, r));
        var i = Math.sqrt(n * n + r * r);
        if (i > 1) i = 1;
        var s = Math.PI / 2;
        if (n != 0) s = Math.atan2(r, n);
        n = i * Math.cos(s);
        r = i * Math.sin(s);
        var o = [];
        if (i < 1) o = [n, r, Math.sqrt(1 - n * n - r * r)];
        else o = [n, r, 0];
        o = sglNormalizedV3(o);
        this.renderer.lightPos = o.slice(0, 3);
        this.renderer.lweights = this.renderer.computeLightingFunction(o)
    },
    resetViewpoint: function() {
        this.translation[0] = 0;
        this.translation[1] = 0;
        this.mat = sglIdentityM4();
        this.flipMatrix = sglIdentityM4()
    },
    setImageUrl: function(e) {
        this.imageUrl = e
    },
    load: function(e) {
        log("SpiderGL Version : " + SGL_VERSION_STRING + "\n");
        this.xform = new SglTransformStack;
        this.renderer = new MultiResRenderer(e, 256 * 1024 * 1024);
        this.translation = [0, 0];
        this.mat = sglIdentityM4();
        this.flipMatrix = sglIdentityM4();
        if (this.imageUrl != "") this.loadImage(this.imageUrl)
    },
    loadImage: function(e) {
        this.renderer.loadImage(e);
        this.xform = new SglTransformStack;
        this.translation = [0, 0];
        this.mat = sglIdentityM4();
        this.rendering = true;
        this.leftBottom = [(this.renderer._tree.scale[0] - this.renderer.imgWidth) / 2, (this.renderer._tree.scale[1] - this.renderer.imgHeight) / 2];
        this.rightTop = [this.leftBottom[0] + this.renderer.imgWidth, this.leftBottom[1] + this.renderer.imgHeight];
        this.scale = 0;
        var t = this.ui.width;
        var n = this.ui.height;
        var r = this.renderer._tree.scale[0] / this.renderer.imgWidth * t;
        var i = this.renderer._tree.scale[1] / this.renderer.imgHeight * n;
        this.scale = Math.min(r, i);
        this.maxScale = Math.max(this.renderer.imgWidth / t, this.renderer.imgHeight / n) * 2.5;
        this.viewerdx = 100;
        this.viewerdy = 100
    },
    stopRendering: function() {
        this.rendering = false
    },
    setOnDrawCallback: function(e) {
        if (e) this.onDrawCallback = e
    },
    keyDown: function(e, t, n) {
        if (n == "R") this.resetViewpoint();
        if (n == "1") this.renderer.renderData = !this.renderer.renderData;
        if (n == "2") this.renderer.renderBoxes = !this.renderer.renderBoxes
    },
    mouseWheel: function(e, t, n, r) {
        if (this.isMoving) return false;
        var i = n - this.translation[0];
        var s = r - this.translation[1];
        var o = sglPow(.98, 10 * t);
        this._startZoom(o, i, s)
    },
    startZoomIn: function() {
        if (this.isMoving) return false;
        var e = this.ui.width / 2 - this.translation[0];
        var t = this.ui.height / 2 - this.translation[1];
        var n = 1.2;
        this._startZoom(n, e, t)
    },
    startZoomOut: function() {
        if (this.isMoving) return false;
        var e = this.ui.width / 2 - this.translation[0];
        var t = this.ui.height / 2 - this.translation[1];
        var n = .8;
        this._startZoom(n, e, t)
    },
    _startZoom: function(e, t, n) {
        var r = this.mat[0] * e;
        if (r > this.maxScale) e = this.maxScale / this.mat[0];
        if (r < 1) e = 1 / this.mat[0];
        if (r <= 1.00000001) this.moveToCenter = true;
        var i = e * this.mat[0] - this.mat[0];
        if (i > 1e-4 || i < -1e-4) {
            this.animationStack = [];
            var s = this.maxStep * 2;
            var o = 3 * i / (s * s * s);
            var u = -2 * s * o;
            var a = o * s * s;
            var f = this.mat[0];
            for (var l = 0; l < s; l++) {
                var c = o * l + o / 3 + u / 2 + a;
                a += o * (2 * l + 1) + u;
                var h = 1 + c / f;
                f += c;
                this.animationStack.push([h, t, n])
            }
            this.animating = this.moveToCenter;
            var p = this;
            clearInterval(this.moveInterval);
            clearInterval(this.zoomInterval);
            this.zoomInterval = setInterval(function() {
                p._zoomAnimation()
            }, 35);
            this.renderer.updateData = false;
            this.isMoving = this.moveToCenter
        } else if (this.moveToCenter) {
            this.animating = true;
            this.isMoving = true;
            var p = this;
            this.animationStack = [];
            clearInterval(this.moveInterval);
            clearInterval(this.zoomInterval);
            this.zoomInterval = setInterval(function() {
                p._zoomAnimation()
            }, 35);
            this.renderer.updateData = false
        }
        return false
    },
    _zoomAnimation: function() {
        if (this.animationStack.length == 0) {
            clearInterval(this.zoomInterval);
            if (this.moveToCenter) {
                var e = this;
                clearInterval(this.moveInterval);
                this.moveInterval = setInterval(function() {
                    e._moveAnimation()
                }, 35);
                this.renderer.updateData = false;
                this.isMoving = true;
                this.computeModelMatrix();
                var t = this.xform.model.top;
                var n = [this.renderer._tree.scale[0] / 2, this.renderer._tree.scale[1] / 2];
                var r = [this.ui.width / 2, this.ui.height / 2];
                var i = sglMulM4V4(t, sglV4C(n[0], n[1], 0, 1)).slice(0, 2);
                var s = r[0] - i[0];
                var o = r[1] - i[1];
                this.currentSpeed = 0;
                this.currentPoint = i;
                this._updateMoveStack(i, r, sglV2C(s, o))
            } else this.renderer.updateData = true;
            this.animating = false;
            return
        }
        var u = this.animationStack.splice(0, 1)[0];
        var a = u[0];
        tx = u[1];
        ty = u[2];
        var f = sglMulM4(sglTranslationM4C(tx, ty, 0), sglMulM4(sglScalingM4C(a, a, 1), sglMulM4(sglTranslationM4C(-tx, -ty, 0), this.mat)));
        var l = this.returnModelMatrix(this.translation, f);
        var c = sglMulM4V4(l, sglV4C(this.leftBottom[0], this.leftBottom[1], 0, 1)).slice(0, 2);
        var h = sglMulM4V4(l, sglV4C(this.rightTop[0], this.rightTop[1], 0, 1)).slice(0, 2);
        c[0] -= this.viewerdx;
        c[1] -= this.viewerdy;
        h[0] += this.viewerdx;
        h[1] += this.viewerdy;
        var p = h[0] - c[0];
        var d = h[1] - c[1];
        var s = 0;
        var o = 0;
        if (p > this.ui.width && d > this.ui.height) {
            if (h[0] < this.ui.width) s += this.ui.width - h[0];
            else if (c[0] > 0) s -= c[0];
            if (h[1] < this.ui.height) o += this.ui.height - h[1];
            else if (c[1] > 0) o -= c[1]
        } else if (p > this.ui.width) {
            ty = this.ui.height / 2 - this.translation[1];
            if (h[0] < this.ui.width) s += this.ui.width - h[0];
            else if (c[0] > 0) s -= c[0]
        } else if (d > this.ui.height) {
            tx = this.ui.width / 2 - this.translation[0];
            if (h[1] < this.ui.height) o += this.ui.height - h[1];
            else if (c[1] > 0) o -= c[1]
        } else {
            tx = this.ui.width / 2;
            ty = this.ui.height / 2;
            this.resetViewpoint();
            if (this.animationStack.lenght == 0) {
                clearInterval(this.zoomInterval);
                this.renderer.updateData = true
            }
            return
        }
        this.mat = sglMulM4(sglTranslationM4C(tx, ty, 0), sglMulM4(sglScalingM4C(a, a, 1), sglMulM4(sglTranslationM4C(-tx, -ty, 0), this.mat)));
        this.translation[0] += s;
        this.translation[1] += o;
        _SGL_RegisteredCanvas[this.canvas].requestDraw();
        return
    },
    sendMouseDown: function(e) {
        _SGL_RegisteredCanvas[this.canvas].mouseDown(e)
    },
    mouseDown: function(e, t, n, r) {
        if (this.animating) return false;
        if (t == 0) {
            if (this.ui.keysDown[17]) {
                this._setLightDir(n, r);
                return true
            }
            if (this.mode == 0) {
                this.endAnimation = false;
                this.currentPoint = [n, r];
                this.animationStack = [];
                var i = this;
                clearInterval(this.zoomInterval);
                clearInterval(this.moveInterval);
                this.moveInterval = setInterval(function() {
                    i._moveAnimation()
                }, 35);
                this.renderer.updateData = false;
                this.isMoving = true;
                return false
            } else if (this.mode == 1) this._setLightDir(n, r);
            return true
        }
    },
    _moveAnimation: function() {
        if ((this.moveToCenter || this.endAnimation) && this.animationStack.length == 0) {
            clearInterval(this.moveInterval);
            this.renderer.updateData = true;
            this.isMoving = false;
            this.animating = false;
            this.moveToCenter = false;
            return
        }
        if (this.animationStack.length == 0) {
            this.currentSpeed = 0;
            return
        }
        var e = this.animationStack.splice(0, 1)[0];
        var t = e[0] - this.currentPoint[0];
        var n = e[1] - this.currentPoint[1];
        this.currentSpeed = e[2];
        this.translation[0] += t;
        this.translation[1] += n;
        this.currentPoint[0] = e[0];
        this.currentPoint[1] = e[1];
        _SGL_RegisteredCanvas[this.canvas].requestDraw();
        return
    },
    mouseUp: function(e, t, n, r) {
        if (t == 0) {
            if (this.mode == 0) {
                this.endAnimation = true;
                this.renderer.updateData = true;
                this.isMoving = false
            }
        }
        return false
    },
    mouseOut: function(e, t, n, r) {
        this.endAnimation = true;
        this.isMoving = false
    },
    mouseMove: function(e, t, n) {
        if (this.animating) return false;
        if (this.ui.mouseButtonsDown[0]) {
            if (this.mode == 0) {
                if (this.ui.keysDown[17]) {
                    this._setLightDir(t, n);
                    return true
                }
                var r = [t, n];
                var i = r[0] - this.currentPoint[0];
                var s = r[1] - this.currentPoint[1];
                var o = this._adjustTranslation(i, s);
                r = [this.currentPoint[0] + o[0], this.currentPoint[1] + o[1]];
                this._updateMoveStack(this.currentPoint, r, o);
                return false
            } else this._setLightDir(t, n);
            return true
        }
        return false
    },
    _updateMoveStack: function(e, t, n) {
        var r = sglLengthV2(n);
        if (r > .1) {
            this.animationStack.splice(0, this.animationStack.length);
            var i = sglNormalizedV2(n);
            var s = (r / 2 - this.currentSpeed * this.maxStep) * 2 / (this.maxStep * this.maxStep);
            var o = this.currentSpeed;
            var u = [e[0], e[1]];
            var a = 0;
            var f = this.maxStep;
            var l = 0;
            var c = 0;
            if (s > 0) {
                for (var h = 0; h < this.maxStep; h++) {
                    var p = s / 2 + o;
                    o += s;
                    a += p;
                    var d = i[0] * p;
                    var v = i[1] * p;
                    u[0] += d;
                    u[1] += v;
                    this.animationStack.push([u[0], u[1], o, s])
                }
                f = 3 * r / (2 * o);
                c = 4 * o * o * o / (9 * r * r);
                l = -4 * o * o / (3 * r)
            } else {
                f = 6 * r / (2 * o);
                c = o * o * o / (9 * r * r);
                l = -2 * o * o / (3 * r)
            }
            for (var h = 0; h < f; h++) {
                var p = c * h + c / 3 + l / 2 + o;
                o += c * (2 * h + 1) + l;
                var m = c * (h + 1) + l;
                var d = i[0] * p;
                var v = i[1] * p;
                u[0] += d;
                u[1] += v;
                this.animationStack.push([u[0], u[1], o, c])
            }
            this.animationStack.push([t[0], t[1], 0, 0])
        }
    },
    _adjustTranslation: function(e, t) {
        var n = sglV4C(this.translation[0] + e, this.translation[1] + t, 0, 1);
        var r = this.returnModelMatrix(n, this.mat);
        var i = sglMulM4V4(r, sglV4C(this.leftBottom[0], this.leftBottom[1], 0, 1)).slice(0, 2);
        var s = sglMulM4V4(r, sglV4C(this.rightTop[0], this.rightTop[1], 0, 1)).slice(0, 2);
        i[0] -= this.viewerdx;
        i[1] -= this.viewerdy;
        s[0] += this.viewerdx;
        s[1] += this.viewerdy;
        var o = s[0] - i[0];
        var u = s[1] - i[1];
        var a = e;
        var f = t;
        if (o > this.ui.width && u > this.ui.height) {
            if (s[0] < this.ui.width) a += this.ui.width - s[0];
            else if (i[0] > 0) a -= i[0];
            if (s[1] < this.ui.height) f += this.ui.height - s[1];
            else if (i[1] > 0) f -= i[1]
        } else if (o > this.ui.width) {
            if (s[0] < this.ui.width) a += this.ui.width - s[0];
            else if (i[0] > 0) a -= i[0];
            f = 0
        } else if (u > this.ui.height) {
            if (s[1] < this.ui.height) f += this.ui.height - s[1];
            else if (i[1] > 0) f -= i[1];
            a = 0
        } else {
            a = 0;
            f = 0
        }
        return sglV2C(a, f)
    },
    update: function(e, t) {},
    returnModelMatrix: function(e, t) {
        var n = sglMulM4(sglTranslationM4C(e[0], e[1], 1), t);
        n = sglMulM4(this.flipMatrix, n);
        this.xform.model.load(n);
        var r = sglTranslationM4C(this.ui.width / 2, this.ui.height / 2, 0);
        this.xform.model.multiply(r);
        this.xform.model.scale(this.scale, this.scale, 1);
        this.xform.model.multiply(this.renderer.normalizedTreeTransform);
        return this.xform.model.top
    },
    computeModelMatrix: function() {
        var e = sglMulM4(sglTranslationM4C(this.translation[0], this.translation[1], 1), this.mat);
        e = sglMulM4(this.flipMatrix, e);
        this.xform.model.load(e);
        var t = sglTranslationM4C(this.ui.width / 2, this.ui.height / 2, 0);
        this.xform.model.multiply(t);
        this.xform.model.scale(this.scale, this.scale, 1);
        this.xform.model.multiply(this.renderer.normalizedTreeTransform)
    },
    draw: function(e) {
        var t = e.getError();
        if (t == e.CONTEXT_LOST_WEBGL) console.log("WebGL Context lost");
        e.clearColor(0, 0, 0, 1);
        e.clear(e.COLOR_BUFFER_BIT | e.DEPTH_BUFFER_BIT | e.STENCIL_BUFFER_BIT);
        if (this.rendering) {
            var n = this.ui.width;
            var r = this.ui.height;
            e.viewport(0, 0, n, r);
            this.xform.projection.loadIdentity();
            this.xform.projection.ortho(0, n, 0, r, -4096, 4096);
            this.xform.view.loadIdentity();
            this.xform.view.lookAt(0, 0, 2, 0, 0, 0, 0, 1, 0);
            this.computeModelMatrix();
            var i = this.xform.model.top;
            if (this.onDrawCallback) this.onDrawCallback(i);
            this.renderer.render(this.xform.projectionMatrix, this.xform.modelViewMatrix, [0, 0, n, r])
        }
    }
};
MultiResTree.prototype = {
    _load: function(e) {
        this.ready = true;
        var t = sglGetLines(e);
        var n = t.length;
        var r = null;
        var i = 0;
        if (n <= i) return;
        r = t[i++].split(" ");
        if (r.length < 2) return;
        var s = parseInt(r[0]);
        if (s <= 0) return;
        var o = parseInt(r[1]);
        if (o < 0 || o >= s) return;
        if (n <= i) return;
        r = t[i++].split(" ");
        if (r.length < 1) return;
        var u = parseInt(r[0]);
        if (u <= 0) return;
        if (n <= i) return;
        r = t[i++].split(" ");
        if (r.length < 3) return;
        var a = [1, 1, 1];
        a[0] = parseFloat(r[0]);
        a[1] = parseFloat(r[1]);
        a[2] = parseFloat(r[2]);
        if (n <= i) return;
        r = t[i++].split(" ");
        if (r.length < 3) return;
        var f = [0, 0, 0];
        f[0] = parseFloat(r[0]);
        f[1] = parseFloat(r[1]);
        f[2] = parseFloat(r[2]);
        var l = new Array(s);
        for (var c = 0; c < s; ++c) {
            var h = new MultiResNode;
            if (n <= i) return;
            r = t[i++].split(" ");
            if (r.length < 14) return;
            h.id = parseInt(r[0]);
            if (h.id <= 0) return;
            h.parentIndex = parseInt(r[1]);
            if (h.parentIndex < -1 || h.parentIndex >= s) return;
            for (var p = 0; p < 4; ++p) {
                h.childrenIndices[p] = parseInt(r[p + 2]);
                if (h.childrenIndices[p] < -1 || h.childrenIndices[p] >= s) return
            }
            h.projectedSize = parseFloat(r[6]);
            h.zScale = parseFloat(r[7]);
            h.box.min[0] = parseFloat(r[8]);
            h.box.min[1] = parseFloat(r[9]);
            h.box.min[2] = parseFloat(r[10]);
            h.box.max[0] = parseFloat(r[11]);
            h.box.max[1] = parseFloat(r[12]);
            h.box.max[2] = parseFloat(r[13]);
            h.isLeaf = true;
            for (var d = 0; d < 4; ++d) {
                if (h.childrenIndices[d] >= 0) {
                    h.isLeaf = false;
                    break
                }
            }
            l[c] = h
        }
        this.nodesCount = s;
        this.rootIndex = o;
        this.tileSize = u;
        this.scale = a;
        this.offset = f;
        this.nodes = l
    },
    destroy: function(e) {
        var t = null;
        for (var n in this.nodes) {
            t = this.nodes[n];
            if (t.req) {
                t.req.onLoad = null;
                t.req = null
            }
            if (t.data) {
                e(t.data);
                t.data = null
            }
        }
        this.ready = true;
        this.nodesCount = 0;
        this.rootIndex = -1;
        this.nodes = null;
        this.url = null;
        this.tileSize = 0;
        this.scale = [1, 1, 1]
    },
    load: function(e, t) {
        if (!e) return false;
        this._load(e)
    },
    get isEmpty() {
        return this.nodesCount <= 0
    },
    get root() {
        var e = this.rootIndex;
        if (e < 0) return null;
        return this.nodes[e]
    },
    parent: function(e) {
        var t = e.parentIndex;
        if (t < 0) return null;
        return this.nodes[t]
    },
    child: function(e, t) {
        var n = e.childrenIndices[t];
        if (n < 0) return null;
        return this.nodes[n]
    }
};
MultiResRenderer.prototype = {
    computeLightingFunction: function(e) {
        switch (this.enumType[this.type]) {
            case 1:
                var t = Math.atan2(e[1], e[0]);
                if (t < 0) t = 2 * Math.PI + t;
                this.phi = t;
                var n = Math.min(Math.acos(e[2]), Math.PI / 2 - .15);
                this.theta = n;
                var r = Math.cos(t);
                var i = Math.cos(n);
                var s = i * i;
                var o = new Array(9);
                o[0] = 1 / Math.sqrt(2 * Math.PI);
                o[1] = Math.sqrt(6 / Math.PI) * r * Math.sqrt(i - s);
                o[2] = Math.sqrt(3 / (2 * Math.PI)) * (-1 + 2 * i);
                o[3] = Math.sqrt(6 / Math.PI) * Math.sqrt(i - s) * Math.sin(t);
                o[4] = Math.sqrt(30 / Math.PI) * Math.cos(2 * t) * (-i + s);
                o[5] = Math.sqrt(30 / Math.PI) * r * (-1 + 2 * i) * Math.sqrt(i - s);
                o[6] = Math.sqrt(5 / (2 * Math.PI)) * (1 - 6 * i + 6 * s);
                o[7] = Math.sqrt(30 / Math.PI) * (-1 + 2 * i) * Math.sqrt(i - s) * Math.sin(t);
                o[8] = Math.sqrt(30 / Math.PI) * (-i + s) * Math.sin(2 * t);
                return o;
            case 2:
            case 3:
                var o = new Array(6);
                o[0] = e[0] * e[0];
                o[1] = e[1] * e[1];
                o[2] = e[0] * e[1];
                o[3] = e[0];
                o[4] = e[1];
                o[5] = 1;
                return o;
            default:
        }
        return []
    },
    loadImage: function(e) {
        var t = new XMLHttpRequest;
        t.open("GET", e + "/info.xml", false);
        t.send();
        var n = t.responseXML;
        var r = n.getElementsByTagName("Content")[0];
        this.type = r.getAttribute("type");
        if (!(this.type in this.enumType)) return false;
        var i = null;
        switch (this.enumType[this.type]) {
            case 1:
            case 2:
            case 3:
                var s = n.getElementsByTagName("Size")[0];
                var o = n.getElementsByTagName("Scale")[0];
                var u = n.getElementsByTagName("Bias")[0];
                i = n.getElementsByTagName("Tree")[0];
                this.imgWidth = parseInt(s.getAttribute("width"));
                this.imgHeight = parseInt(s.getAttribute("height"));
                this.ordlen = parseInt(s.getAttribute("coefficients"));
                this.numLayers = this.ordlen;
                if (this.enumType[this.type] == 2) this.numLayers = 3;
                tokens = o.childNodes[0].nodeValue.split(" ");
                if (tokens.length < this.ordlen) return;
                this.gmax = [];
                for (var a = 0; a < this.ordlen; a++) this.gmax[a] = parseFloat(tokens[a]);
                tokens = u.childNodes[0].nodeValue.split(" ");
                if (tokens.length < this.ordlen) return;
                this.gmin = [];
                for (var a = 0; a < this.ordlen; a++) this.gmin[a] = parseFloat(tokens[a]);
                break;
            case 4:
                var s = n.getElementsByTagName("Size")[0];
                i = n.getElementsByTagName("Tree")[0];
                this.imgWidth = parseInt(s.getAttribute("width"));
                this.imgHeight = parseInt(s.getAttribute("height"));
                this.ordlen = parseInt(s.getAttribute("coefficients"));
                this.numLayers = this.ordlen;
                break;
            default:
                return
        }
        if (this._tree) this._tree.destroy(this._destroyData);
        this._tree.load(i.textContent);
        this._url = e;
        this._timestamp = 0;
        this._frustum = new SglFrustum;
        this._maxError = 1;
        this._cache = [];
        this._toRequest = [];
        this._toRenderFullRes = [];
        this._toRenderHalfRes = [];
        this._readyItems = [];
        this.renderData = true;
        this.renderBoxes = false;
        this.lightPos = [0, 0, 1];
        this.specularBlend = 0.5;
        this.specularExponent = 250;
        this.lweights = [];
        this.lweights = this.computeLightingFunction(this.lightPos);
        if (this._program != null) this._program.destroy();
        switch (this.enumType[this.type]) {
            case 1:
                var f = sglLoadFile("/sites/all/modules/media_rti/js/spidergl/multi.v.glsl");
                var l = sglLoadFile("/sites/all/modules/media_rti/js/spidergl/hsh.f.glsl");
                var c = new SglProgram(this.gl, [f], [l]);
                log(c.log);
                this._program = c;
                break;
            case 2:
                var f = sglLoadFile("/sites/all/modules/media_rti/js/spidergl/multi.v.glsl");
                var l = sglLoadFile("/sites/all/modules/media_rti/js/spidergl/lrgbptm.f.glsl");
                var c = new SglProgram(this.gl, [f], [l]);
                log(c.log);
                this._program = c;
                break;
            case 3:
                var f = sglLoadFile("/sites/all/modules/media_rti/js/spidergl/multi.v.glsl");
                var l = sglLoadFile("/sites/all/modules/media_rti/js/spidergl/rgbptm.f.glsl");
                var c = new SglProgram(this.gl, [f], [l]);
                log(c.log);
                this._program = c;
                break;
            case 4:
                var f = sglLoadFile("/sites/all/modules/media_rti/js/spidergl/multi.v.glsl");
                var l = sglLoadFile("/sites/all/modules/media_rti/js/spidergl/image.f.glsl");
                var c = new SglProgram(this.gl, [f], [l]);
                log(c.log);
                this._program = c;
                break;
            default:
                this._program = new SglProgram
        }
        this._renderer = new SglMeshGLRenderer(this._program);
        this._treeTransform = sglIdentityM4();
        this._normalizedTreeTransform = sglIdentityM4();
        this.leftTex = (this._tree.scale[0] - this.imgWidth) / 2;
        this.rightTex = this.leftTex + this.imgWidth;
        this.bottomTex = (this._tree.scale[1] - this.imgHeight) / 2;
        this.topTex = this.bottomTex + this.imgHeight;
        this.leftTex /= this._tree.scale[0];
        this.rightTex /= this._tree.scale[0];
        this.bottomTex /= this._tree.scale[1];
        this.topTex /= this._tree.scale[1];
        if (this._tree.ready) this._setupTree()
    },
    _createLg: function() {
        var e = document.createElement("canvas");
        e.height = 50;
        e.width = 80;
        /*var t = e.getContext("2d");
        t.save();
        t.beginPath();
        t.moveTo(0, 0);
        t.lineTo(80, 0);
        t.lineTo(80, 50);
        t.lineTo(0, 50);
        t.closePath();
        t.clip();
        t.strokeStyle = "rgba(0,0,0,0)";
        t.lineCap = "butt";
        t.lineJoin = "miter";
        t.miterLimit = 4;
        t.save();
        t.restore();
        t.save();
        t.restore();
        t.save();
        t.transform(.21814175, 0, 0, .21573678, -3.3721339, -3.3665838);
        t.save();
        t.translate(14.071762, 20);
        t.save();
        g = t.createRadialGradient(239.50893, 204.66128888494003, 0, 239.50893, 204.66128888494003, 31.820419);
        g.addColorStop(0, "rgba(255, 255, 255, 1)");
        g.addColorStop(1, "rgba(151, 151, 151, 1)");
        t.fillStyle = g;
        t.strokeStyle = "#000000";
        t.lineWidth = 2.4923694133758545;
        t.lineCap = "round";
        t.lineJoin = "round";
        t.miterLimit = 4;
        t.transform(2.1234583, 0, 0, 1.6108995, -256.37574, -264.34719);
        t.beginPath();
        t.moveTo(271.42857, 233.79076);
        t.translate(240, 233.80553976769053);
        t.rotate(0);
        t.scale(.7586207296076113, 1);
        t.arc(0, 0, 41.42857, -.00035675303306008355, 3.1419494066230014, 0);
        t.scale(1.318181748760332, 1);
        t.rotate(0);
        t.translate(-240, -233.80553976769053);
        t.translate(240, 233.77598023230948);
        t.rotate(0);
        t.scale(.7586207296076113, 1);
        t.arc(0, 0, 41.42857, 3.141235900556733, 6.2835420602127945, 0);
        t.scale(1.318181748760332, 1);
        t.rotate(0);
        t.translate(-240, -233.77598023230948);
        t.closePath();
        t.fill();
        t.stroke();
        t.restore();
        t.save();
        t.fillStyle = "#ececec";
        t.strokeStyle = "#000000";
        t.lineWidth = 4.609655857086182;
        t.lineCap = "butt";
        t.lineJoin = "round";
        t.miterLimit = 4;
        t.beginPath();
        t.moveTo(49.495605, 44.507569);
        t.lineTo(129.49561, 79.507569);
        t.lineTo(209.49561, 44.507569);
        t.lineTo(49.495605, 44.507569);
        t.closePath();
        t.fill();
        t.stroke();
        t.restore();
        t.save();
        t.fillStyle = "#999999";
        t.strokeStyle = "#000000";
        t.lineWidth = 4.609655857086182;
        t.lineCap = "butt";
        t.lineJoin = "round";
        t.miterLimit = 4;
        t.beginPath();
        t.moveTo(129.49561, 174.50757);
        t.lineTo(129.49561, 79.507572);
        t.lineTo(209.49561, 44.507572);
        t.lineTo(129.49561, 174.50757);
        t.closePath();
        t.fill();
        t.stroke();
        t.restore();
        t.save();
        t.fillStyle = "#b3b3b3";
        t.strokeStyle = "#000000";
        t.lineWidth = 4.609655857086182;
        t.lineCap = "butt";
        t.lineJoin = "round";
        t.miterLimit = 4;
        t.beginPath();
        t.moveTo(129.49561, 174.50757);
        t.lineTo(129.49561, 79.507569);
        t.lineTo(49.495605, 44.507569);
        t.lineTo(129.49561, 174.50757);
        t.closePath();
        t.fill();
        t.stroke();
        t.restore();
        t.save();
        g = t.createLinearGradient(236.58487, 196.44904, 257.4877, 320.66739);
        g.addColorStop(0, "rgba(255, 255, 255, 1)");
        g.addColorStop(1, "rgba(151, 151, 151, 1)");
        t.fillStyle = g;
        t.strokeStyle = "#000000";
        t.lineWidth = 3.3579113483428955;
        t.lineCap = "round";
        t.lineJoin = "round";
        t.miterLimit = 4;
        t.transform(1.4965962, 0, 0, 1.2591977, -86.218969, -182.0266);
        t.beginPath();
        t.moveTo(271.42857, 233.79076);
        t.translate(240, 233.80553976769053);
        t.rotate(0);
        t.scale(.7586207296076113, 1);
        t.arc(0, 0, 41.42857, -.00035675303306008355, 3.1419494066230014, 0);
        t.scale(1.318181748760332, 1);
        t.rotate(0);
        t.translate(-240, -233.80553976769053);
        t.translate(240, 233.77598023230948);
        t.rotate(0);
        t.scale(.7586207296076113, 1);
        t.arc(0, 0, 41.42857, 3.141235900556733, 6.2835420602127945, 0);
        t.scale(1.318181748760332, 1);
        t.rotate(0);
        t.translate(-240, -233.77598023230948);
        t.closePath();
        t.fill();
        t.stroke();
        t.restore();
        t.restore();
        t.restore();
        t.restore();*/
        var n = new Image;
        var r = e.toDataURL("image/png");
        n.src = r;
        var i = {
            generateMipmap: false,
            minFilter: this.gl.NEAREST,
            magFilter: this.gl.NEAREST
        };
        try {
            var s = new SglTexture2D(this.gl, n, i);
            this.lgtex = s
        } catch (o) {
            this.lgtex = null
        }
    },
    _createData: function(e) {
        var t = {
            minFilter: this.gl.LINEAR,
            magFilter: this.gl.LINEAR,
            generateMipmap: false
        };
        var n = new Array(e.length);
        for (var r = 0; r < e.length; ++r) n[r] = new SglTexture2D(this.gl, e[r], t);
        var i = {
            textures: n
        };
        return i
    },
    _destroyData: function(e) {
        if (!e) return;
        for (var t = 0; t < e.textures.length; ++t) e.textures[t].destroy();
        e.textures = null
    },
    _requestNode: function(e) {
        if (e.req) return;
        var t = this;
        var n = this._url + "/" + e.id;
        var r = new Array;
        for (var i = 1; i <= this.numLayers; i++) r.push(new SglImageRequest(n + "_" + i + ".jpg"));
        var s = new SglRequestWatcher(r, function(n) {
            t._currentOngoingRequests--;
            t._readyItems.push(e)
        });
        e.req = s;
        s.send()
    },
    _collectNodesRec: function(e, t) {
        var n = {
            needed: false,
            usable: e.data ? true : false
        };
        if (!t) {
            var r = this._frustum.boxVisibility(e.box.min, e.box.max);
            if (r == SGL_OUTSIDE_FRUSTUM) return n;
            t = r == SGL_INSIDE_FRUSTUM
        }
        n.needed = true;
        var i = this._frustum.projectedSegmentSize(e.box.center, e.box.size[0]);
        var s = i / e.projectedSize;
        e.priority.timestamp = this._timestamp;
        e.priority.error = s;
        if (!n.usable) {
            if (!e.req) {
                this._toRequest.push(e)
            }
            return n
        }
        if (s < this._maxError || e.isLeaf) {
            this._toRenderFullRes.push(e);
            return n
        }
        var o = null;
        var u = 0;
        var a = 0;
        var f = null;
        var l = [];
        for (var c = 0; c < 4; ++c) {
            o = this._tree.child(e, c);
            if (!o) continue;
            f = this._collectNodesRec(o, t);
            if (f.usable) a++;
            if (f.needed) {
                u++;
                if (!f.usable) {
                    l.push(c)
                }
            }
        }
        if (u > 0) {
            if (a <= 0) {
                this._toRenderFullRes.push(e)
            } else if (l.length > 0) {
                this._toRenderHalfRes.push({
                    n: e,
                    children: l
                })
            }
        }
        return n
    },
    _collectNodes: function() {
        this._toRequest = [];
        this._toRenderFullRes = [];
        this._toRenderHalfRes = [];
        var e = this._tree.root;
        if (!e) return;
        this._collectNodesRec(e, false)
    },
    _renderNodeFullRes: function(e) {
        var t = {
            u_world_box_min: e.box.min,
            u_world_box_max: e.box.max
        };
        var n = [];
        for (var r = 0; r < this.numLayers; r++) n["coeff" + r] = e.data.textures[r];
        this._renderer.setUniforms(t);
        this._renderer.setSamplers(n);
        this._renderer.render()
    },
    _renderNodesFullRes: function(e) {
        var t = null;
        var n = null;
        t = this._tileFullMesh;
        n = "tristrip";
        var r = {
            u_model_view_projection_matrix: e,
            u_scale_bias: [1, 1, 0, 0],
            u_texcoord_scale_bias: [this._tree.tileSize / (this._tree.tileSize + 2), 1 / (this._tree.tileSize + 2)],
            ordlen: this.ordlen,
            leftTex: this.leftTex,
            rightTex: this.rightTex,
            bottomTex: this.bottomTex,
            topTex: this.topTex,

            theta: this.theta,
            phi: this.phi,

            specularBlend: this.specularBlend,
            specularExponent: this.specularExponent

        };
        if (this.enumType[this.type] != 4) {
            for (var i = 0; i < this.ordlen; i++) {
                r["gmax" + i] = this.gmax[i];
                r["gmin" + i] = this.gmin[i];
                r["lweight" + i] = this.lweights[i]
            }
        }
        this._renderer.begin();
        this._renderer.setUniforms(r);
        this._renderer.beginMesh(t);
        this._renderer.beginPrimitives(n);
        var s = null;
        for (var i in this._toRenderFullRes) {
            s = this._toRenderFullRes[i];
            this._renderNodeFullRes(s)
        }
        this._renderer.endPrimitives();
        this._renderer.endMesh();
        this._renderer.end()
    },
    _renderNodeHalfRes: function(e, t) {
        var n = {
            u_world_box_min: null,
            u_world_box_max: null,
            u_scale_bias: null
        };
        var r = [];
        for (var i = 0; i < this.numLayers; i++) r["coeff" + i] = e.data.textures[i];
        this._renderer.setSamplers(r);
        var s = [
            [.5, .5, 0, 0],
            [.5, .5, .5, 0],
            [.5, .5, 0, .5],
            [.5, .5, .5, .5]
        ];
        var o = null;
        for (var i in t) {
            o = this._tree.child(e, t[i]);
            n.u_world_box_min = o.box.min;
            n.u_world_box_max = o.box.max;
            n.u_scale_bias = s[t[i]];
            this._renderer.setUniforms(n);
            this._renderer.render()
        }
    },
    _renderNodesHalfRes: function(e) {
        var t = null;
        var n = null;
        t = this._tileHalfMesh;
        n = "tristrip";
        var r = {
            u_model_view_projection_matrix: e,
            u_texcoord_scale_bias: [this._tree.tileSize / (this._tree.tileSize + 2), 1 / (this._tree.tileSize + 2)],
            ordlen: this.ordlen,
            leftTex: this.leftTex,
            rightTex: this.rightTex,
            bottomTex: this.bottomTex,
            topTex: this.topTex
        };
        if (this.enumType[this.type] != 4) {
            for (var i = 0; i < this.ordlen; i++) {
                r["gmax" + i] = this.gmax[i];
                r["gmin" + i] = this.gmin[i];
                r["lweight" + i] = this.lweights[i]
            }
        }
        this._renderer.begin();
        this._renderer.setUniforms(r);
        this._renderer.beginMesh(t);
        this._renderer.beginPrimitives(n);
        var s = null;
        for (var i in this._toRenderHalfRes) {
            s = this._toRenderHalfRes[i];
            this._renderNodeHalfRes(s.n, s.children)
        }
        this._renderer.endPrimitives();
        this._renderer.endMesh();
        this._renderer.end()
    },
    _renderNodes: function(e) {
        this._renderNodesFullRes(e);
        this._renderNodesHalfRes(e)
    },
    _renderNodeFullResBox: function(e) {
        var t = e.box.size;
        var n = {
            u_world_box_min: sglAddV3S(e.box.min, t[0] * .05),
            u_world_box_max: sglSubV3S(e.box.max, t[0] * .05),
            u_color: e.isLeaf ? [1, 0, 1] : [0, 1, 0]
        };
        this._boxRenderer.setUniforms(n);
        this._boxRenderer.render()
    },
    _renderNodesFullResBoxes: function(e) {
        var t = {
            u_model_view_projection_matrix: e
        };
        this._boxRenderer.begin();
        this._boxRenderer.setUniforms(t);
        this._boxRenderer.beginMesh(this._boxMesh);
        this._boxRenderer.beginPrimitives("edges");
        var n = null;
        for (var r in this._toRenderFullRes) {
            n = this._toRenderFullRes[r];
            this._renderNodeFullResBox(n)
        }
        this._boxRenderer.endPrimitives();
        this._boxRenderer.endMesh();
        this._boxRenderer.end()
    },
    _renderNodeHalfResBox: function(e, t) {
        var n = {
            u_world_box_min: null,
            u_world_box_max: null,
            u_color: null
        };
        var r = null;
        var i = null;
        for (var s in t) {
            r = this._tree.child(e, t[s]);
            sz = r.box.size;
            n.u_world_box_min = sglAddV3S(r.box.min, sz[0] * .05);
            n.u_world_box_max = sglSubV3S(r.box.max, sz[0] * .05);
            n.u_color = r.isLeaf ? [1, 1, 0] : [1, 1, 1];
            this._boxRenderer.setUniforms(n);
            this._boxRenderer.render()
        }
    },
    _renderNodesHalfResBoxes: function(e) {
        var t = {
            u_model_view_projection_matrix: e
        };
        this._boxRenderer.begin();
        this._boxRenderer.setUniforms(t);
        this._boxRenderer.beginMesh(this._boxMesh);
        this._boxRenderer.beginPrimitives("edges");
        var n = null;
        for (var r in this._toRenderHalfRes) {
            n = this._toRenderHalfRes[r];
            this._renderNodeHalfResBox(n.n, n.children)
        }
        this._boxRenderer.endPrimitives();
        this._boxRenderer.endMesh();
        this._boxRenderer.end()
    },
    _renderNodesBoxes: function(e) {
        this.gl.lineWidth(2);
        this.gl.depthFunc(this.gl.LEQUAL);
        this._renderNodesFullResBoxes(e);
        this._renderNodesHalfResBoxes(e);
        this.gl.depthFunc(this.gl.LESS);
        this.gl.lineWidth(1)
    },
    _doRender: function(e, t, n) {
        var r = sglMulM4(t, this._treeTransform);
        this._timestamp++;
        this._frustum.setup(e, r, n);
        this._collectNodes();
        var i = sglMulM4(e, r);
        if (this.renderData) this._renderNodes(i);
        if (this.renderBoxes) this._renderNodesBoxes(i);
        if (this.lgtex == null) this._createLg();
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        var s = sglMulM4(e, sglScalingM4C(1, 1, 1));
        var o = {
            u_mvp: s
        };
        var u = {
            s_texture: this.lgtex
        };
        sglRenderMeshGLPrimitives(this.lgMesh, "tristrip", this.texProg, null, o, u);
        this.gl.disable(this.gl.BLEND)
    },
    _updateCache: function() {
        var e = 1;
        var t = this._readyItems.slice(0, e);
        this._readyItems.splice(0, e);
        var n = this._cache.concat(t);
        n.sort(_MultiResCompareNodes);
        var r = n.length;
        var i = this._maxCacheSize < r ? this._maxCacheSize : r;
        this._cache = n.splice(0, i);
        var s = n;
        var o = null;
        var u = null;
        var a = [];
        for (var f = 0; f < i; ++f) {
            o = this._cache[f];
            u = o.req;
            o.req = null;
            if (!u) continue;
            if (!u.succeeded) {
                a.push(f);
                continue
            }
            var l = new Array(u.requests.length);
            for (var f = 0; f < l.length; ++f) l[f] = u.requests[f].image;
            if (o.data) this._destroyData(o.data);
            o.data = this._createData(l)
        }
        var c = a.length;
        var h = 0;
        i = s.length;
        for (var f = 0; f < i; ++f) {
            o = s[f];
            u = o.req;
            o.req = null;
            if (u) continue;
            if (h < c) {
                this._cache[a[h]] = o;
                h++
            } else {
                this._destroyData(o.data);
                o.data = null
            }
        }
        if (h > 0) this._cache.sort(_MultiResCompareNodes)
    },
    _requestNodes: function() {
        var e = this._cache.length;
        var t = e > 0 ? this._cache[e - 1] : null;
        this._toRequest.sort(_MultiResCompareNodes);
        var n = this._maxOngoingRequests - this._currentOngoingRequests;
        var r = 0;
        var i = this._toRequest.length;
        var s = null;
        var o = false;
        for (var u = 0; u < i && r < n; ++u) {
            s = this._toRequest[u];
            if (s.req) continue;
            o = true;
            if (t != null && e >= this._maxCacheSize) o = _MultiResCompareNodes(s, t) < 0;
            if (o) {
                this._requestNode(s);
                r++
            }
        }
    },
    _calculateNormalizedTreeTransform: function() {
        var e = this._tree.root;
        if (!e) return sglIdentityM4();
        var t = new SglBox3;
        t.min = sglAddV3(sglMulV3(e.box.min, this._tree.scale), this._tree.offset);
        t.max = sglAddV3(sglMulV3(e.box.max, this._tree.scale), this._tree.offset);
        this._treeTransform = sglMulM4(sglTranslationM4V(this._tree.offset), sglScalingM4V(this._tree.scale));
        var n = t.center;
        var r = t.size;
        var i = r[0];
        if (i < r[1]) i = r[1];
        if (i < r[2]) i = r[2];
        var s = i > 0 ? 1 / i : 1;
        var o = sglScalingM4C(s, s, s);
        var u = sglTranslationM4C(-n[0], -n[1], -n[2]);
        var a = sglMulM4(o, u);
        this._normalizedTreeTransform = a
    },
    _setupTree: function() {
        var e = this._tree.root;
        if (!e) return;
        var t = this.gl;
        var n = (this._tree.tileSize + 2) * (this._tree.tileSize + 2) * this.ordlen * 3;
        this._maxCacheSize = sglFloor(this._cacheSizeInBytes / n);
        if (this._maxCacheSize <= 0) this._maxCacheSize = 1;
        var r = new Float32Array([-.5, .5, -.5, -.5, .5, .5, .5, -.5]);
        var i = new SglMeshGL(t);
        i.addVertexAttribute("position", 2, r);
        i.addArrayPrimitives("tristrip", t.TRIANGLE_STRIP, 0, 4);
        this._tileFullMesh = i;
        this._tileHalfMesh = i;
        this._calculateNormalizedTreeTransform()
    },
    render: function(e, t, n) {
        if (!this._tree.root) return;
        this._doRender(e, t, n);
        if (this.updateData) {
            this._updateCache();
            this._requestNodes()
        }
    },
    get normalizedTreeTransform() {
        return this._normalizedTreeTransform
    }
}


