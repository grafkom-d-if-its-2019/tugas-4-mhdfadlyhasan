(function() {
    function onKeyDown(event) {
        if (event.keyCode == 83) thetaSpeed -= 0.01; //key 's' google chrome
        else if (event.keyCode == 87) thetaSpeed += 0.01; //key 'w'
        else if (event.keyCode == 48) thetaSpeed = 0; //key '0'
        if (event.keyCode == 190) camera.z -= 0.1; //key '/'
        else if (event.keyCode == 191) camera.z += 0.1; //key '.'
        if (event.keyCode == 37) camera.x -= 0.1; //key kiri
        else if (event.keyCode == 39) camera.x += 0.1; //key kanan
        if (event.keyCode == 38) camera.y += 0.1; //key atas 
        else if (event.keyCode == 40) camera.y -= 0.1; //key Bawah
    }
    document.addEventListener('keydown', onKeyDown);

    var canvas, gl, program,
        scaleXUniformLocation, scaleX,
        melebar, theta, thetaSpeed, mmLoc,
        mm, vmLoc, vm, pmLoc, pm, camera, xHurufLocation,
        triangleX, yHurufLocation, triangleY, zHurufLocation,
        triangleZ, arahX, arahY, arahZ, dcLoc, dc, ddLoc, dd, acLoc,
        ac, nmLoc, vNormal, vTexCoord, vColor, flag, flagUniformLocation,
        fFlagUniformLocation, theta, phi;
    var verticescube = [];
    var cubePoints = [
        [-0.8, -0.8, 0.8],
        [-0.8, 0.8, 0.8],
        [0.8, 0.8, 0.8],
        [0.8, -0.8, 0.8],
        [-0.8, -0.8, -0.8],
        [-0.8, 0.8, -0.8],
        [0.8, 0.8, -0.8],
        [0.8, -0.8, -0.8]
    ];
    var cubeColors = [
        [],
        [0.0, 1.0, 1.0], //biru hijau
        [0.0, 1.0, 0.5], //hijau biru
        [0.0, 1.0, 0.5], //hijau biru
        [0.0, 1.0, 0.5], //hijau biru
        [0.0, 1.0, 0.5], //hijau biru
        [0.0, 1.0, 0.5], //hijau biru
        []
    ];
    var cubeNormals = [
        [],
        [0.0, 0.0, 1.0], //depan
        [1.0, 0.0, 0.0], //kanan
        [0.0, -1.0, 0.0], //bawah
        [0.0, 0.0, -1.0], //belakang
        [-1.0, 0.0, 0.0], //kiri
        [0.0, 1.0, 0.0], //atas
        []
    ];

    function Quad(a, b, c, d) {
        var indices = [a, b, c, a, c, d];
        for (var i = 0; i < indices.length; i++) {
            for (var j = 0; j < 3; j++) {
                verticescube.push(cubePoints[indices[i]][j]);
            }
            for (var j = 0; j < 3; j++) {
                verticescube.push(cubeColors[a][j]);
            }
            for (var j = 0; j < 3; j++) {
                verticescube.push(-1 * cubeNormals[a][j]);
            }
            switch (indices[i]) {
                case a:
                    verticescube.push((a - 2) * 0.125);
                    verticescube.push(0.0);
                    break;
                case b:
                    verticescube.push((a - 2) * 0.125);
                    verticescube.push(1.0);
                    break;
                case c:
                    verticescube.push((a - 1) * 0.125);
                    verticescube.push(1.0);
                    break;
                case d:
                    verticescube.push((a - 1) * 0.125);
                    verticescube.push(0.0);
                    break;

                default:
                    break;
            }
        }
    }

    var verticeTriangle = new Float32Array([
        //x,y,z           //r,g,b

        +0.3, -0.9, 0, 1, 1, 1,

        +0.5, -0.9, 0, 1, 1, 1,

        +0.5, -0.3, 0, 1, 1, 1,

        +0.8, -0.3, 0, 1, 1, 1,

        +0.8, +0.0, 0, 1, 1, 1,

        +0.5, +0.0, 0, 1, 1, 1,

        +0.5, +0.3, 0, 1, 1, 1,

        +1.0, +0.3, 0, 1, 1, 1,

        +1.0, +0.7, 0, 1, 1, 1,

        +0.3, -0.3, 0, 1, 1, 1,

        +0.5, -0.3, 0, 1, 1, 1,

        +0.3, -0.9, 0, 1, 1, 1,

        +0.5, +0.0, 0, 1, 1, 1,

        +0.5, -0.3, 0, 1, 1, 1,

        +0.8, -0.3, 0, 1, 1, 1,

        +0.5, +0.7, 0, 1, 1, 1,

        +1.0, +0.7, 0, 1, 1, 1,

        +0.5, +0.3, 0, 1, 1, 1,

        +0.5, +0.7, 0, 1, 1, 1,

        +0.3, -0.3, 0, 1, 1, 1,

        +0.5, -0.3, 0, 1, 1, 1,

        +0.3, +0.7, 0, 1, 1, 1,

        +0.3, -0.3, 0, 1, 1, 1,

        +0.5, +0.7, 0, 1, 1, 1

    ]);

    glUtils.SL.init({ callback: function() { main(); } });

    //image for texture
    function initTexture() {
        //uniform for texture
        var sampler0Loc = gl.getUniformLocation(program, 'sampler0');
        gl.uniform1i(sampler0Loc, 0);

        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
            new Uint8Array([0, 0, 0, 0]));

        //load image
        var image = new Image();
        image.src = "foto.jpg";
        image.addEventListener('load', function() {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.generateMipmap(gl.TEXTURE_2D);
        });
    }

    function initBuffers(gl, vertices) {
        var n = vertices.length / 6;

        var vertexBufferObject = gl.createBuffer();
        if (!vertexBufferObject) {
            console.log('Failed to create the buffer object');
            return -1;
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        var vPosition = gl.getAttribLocation(program, 'vPosition');
        if (vPosition < 0) {
            console.log('Failed to get the storage location of vPosition');
            return -1;
        }

        vColor = gl.getAttribLocation(program, 'vColor');
        if (vColor < 0) {
            console.log('Failed to get the storage location of vColor');
            return -1;
        }

        gl.vertexAttribPointer(
            vPosition,
            3,
            gl.FLOAT,
            gl.FALSE,
            6 * Float32Array.BYTES_PER_ELEMENT,
            0
        );

        gl.vertexAttribPointer(
            vColor,
            3,
            gl.FLOAT,
            gl.FALSE,
            6 * Float32Array.BYTES_PER_ELEMENT,
            3 * Float32Array.BYTES_PER_ELEMENT
        );

        gl.enableVertexAttribArray(vPosition);
        gl.enableVertexAttribArray(vColor);

        return n;
    }

    function initBuffersKubus(gl, vertices) {
        var n = vertices.length / 11;
        var vertexBufferObject = gl.createBuffer();
        if (!vertexBufferObject) {
            console.log('Failed to create the buffer object');
            return -1;
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        var vPosition = gl.getAttribLocation(program, 'vPosition');
        if (vPosition < 0) {
            console.log('Failed to get the storage location of vPosition');
            return -1;
        }

        vNormal = gl.getAttribLocation(program, 'vNormal');
        if (vNormal < 0) {
            console.log('Failed to get the storage location of vNormal');
            return -1;
        }

        vTexCoord = gl.getAttribLocation(program, 'vTexCoord');
        if (vTexCoord < 0) {
            console.log('Failed to get the storage location of vTexCoord');
            return -1;
        }

        // Assign the buffer object to vPosition variable
        gl.vertexAttribPointer(
            vPosition,
            3,
            gl.FLOAT,
            gl.FALSE,
            11 * Float32Array.BYTES_PER_ELEMENT,
            0
        );

        gl.vertexAttribPointer(
            vNormal,
            3,
            gl.FLOAT,
            gl.FALSE,
            11 * Float32Array.BYTES_PER_ELEMENT,
            6 * Float32Array.BYTES_PER_ELEMENT
        );

        gl.vertexAttribPointer(
            vTexCoord,
            2,
            gl.FLOAT,
            gl.FALSE,
            11 * Float32Array.BYTES_PER_ELEMENT,
            9 * Float32Array.BYTES_PER_ELEMENT
        );

        gl.enableVertexAttribArray(vPosition);
        gl.enableVertexAttribArray(vNormal);
        gl.enableVertexAttribArray(vTexCoord);

        return n;
    }


    //mouse
    var AMORTIZATION = 0.80;
    var drag = false;
    var old_x, old_y;
    var dX = 0,
        dY = 0;
    theta = 0;
    phi = 0;

    var mouseDown = function(e) {
        drag = true;
        old_x = e.pageX, old_y = e.pageY;
        e.preventDefault();
        return false;
    };

    var mouseUp = function(e) {
        drag = false;
    };

    var mouseMove = function(e) {
        if (!drag) return false;
        dX = (e.pageX - old_x) * 2 * Math.PI / canvas.width,
            dY = (e.pageY - old_y) * 2 * Math.PI / canvas.height;
        theta += dX;
        phi += dY;
        old_x = e.pageX, old_y = e.pageY;
        e.preventDefault();
    };

    document.addEventListener("mousedown", mouseDown, false);
    document.addEventListener("mouseup", mouseUp, false);
    document.addEventListener("mouseout", mouseUp, false);
    document.addEventListener("mousemove", mouseMove, false);


    //rotasi
    function rotateX(m, angle) {
        var c = Math.cos(angle);
        var s = Math.sin(angle);
        var mv1 = m[1],
            mv5 = m[5],
            mv9 = m[9];

        m[1] = m[1] * c - m[2] * s;
        m[5] = m[5] * c - m[6] * s;
        m[9] = m[9] * c - m[10] * s;

        m[2] = m[2] * c + mv1 * s;
        m[6] = m[6] * c + mv5 * s;
        m[10] = m[10] * c + mv9 * s;
    }

    function rotateY(m, angle) {
        var c = Math.cos(angle);
        var s = Math.sin(angle);
        var mv0 = m[0],
            mv4 = m[4],
            mv8 = m[8];

        m[0] = c * m[0] + s * m[2];
        m[4] = c * m[4] + s * m[6];
        m[8] = c * m[8] + s * m[10];

        m[2] = c * m[2] - s * mv0;
        m[6] = c * m[6] - s * mv4;
        m[10] = c * m[10] - s * mv8;
    }

    //translasi
    function Translate() {
        if (triangleX >= (0.8 - Math.abs(0.2 * 0.7 * scaleX))) arahX = -1.0;
        else if (triangleX <= (-0.8 + Math.abs(0.2 * 0.7 * scaleX))) arahX = 1.0;
        triangleX += 0.009 * arahX;
        gl.uniform1f(xHurufLocation, triangleX);

        if (triangleY >= (0.8 - (0.3 * 0.7))) arahY = -1.0;
        else if (triangleY <= (-0.8 + (0.3 * 0.7))) arahY = 1.0;
        triangleY += 0.010 * arahY;
        gl.uniform1f(yHurufLocation, triangleY);

        if (triangleZ >= (0.8 - Math.abs(0.2 * 0.7 * scaleX))) arahZ = -1.0;
        else if (triangleZ <= (-0.8 + Math.abs(0.2 * 0.7 * scaleX))) arahZ = 1.0;
        triangleZ += 0.011 * arahZ;
        gl.uniform1f(zHurufLocation, triangleZ);
    }

    //render
    function render() {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        theta += thetaSpeed;

        //perhitungan modelMatrix untuk vektor normal
        var nm = glMatrix.mat3.create();
        glMatrix.mat3.normalFromMat4(nm, mm);
        gl.uniformMatrix3fv(nmLoc, false, nm);

        glMatrix.mat4.lookAt(vm, [camera.x, camera.y, camera.z], //posisi kamera (posisi)
            [0.0, 0.0, -2.0], //kamera menghadap (vektor)
            [0.0, 1.0, 0.0] //arah atas kamera (vektor)
        );
        gl.uniformMatrix4fv(vmLoc, false, vm);

        //interaksi mouse

        if (!drag) {
            dX *= AMORTIZATION, dY *= AMORTIZATION;
            theta += dX, phi += dY;
        }

        mm[0] = 1, mm[1] = 0, mm[2] = 0, mm[3] = 0,

            mm[4] = 0, mm[5] = 1, mm[6] = 0, mm[7] = 0,

            mm[8] = 0, mm[9] = 0, mm[10] = 1, mm[11] = 0,

            mm[12] = 0, mm[13] = 0, mm[14] = 0, mm[15] = 1;

        glMatrix.mat4.translate(mm, mm, [0.0, 0.0, -2.0]);

        rotateY(mm, theta);
        rotateX(mm, phi);

        gl.uniformMatrix4fv(mmLoc, false, mm);

        var nCube = initBuffersKubus(gl, verticescube);
        if (nCube < 0) {
            console.log('Failed to set the positions of the verticescube');
            return;
        }

        flag = 0;
        gl.uniform1i(flagUniformLocation, flag);
        gl.uniform1i(fFlagUniformLocation, flag);
        gl.drawArrays(gl.TRIANGLES, 0, nCube);

        gl.disableVertexAttribArray(vNormal);
        gl.disableVertexAttribArray(vTexCoord);

        //animasi refleksi
        if (scaleX >= 1.0) melebar = -1.0;
        else if (scaleX <= -1.0) melebar = 1.0;

        scaleX += 0.0078 * melebar;

        gl.uniform1f(scaleXUniformLocation, scaleX);

        //animasi translasi
        Translate();

        dd = glMatrix.vec3.fromValues(triangleX, triangleY, triangleZ);
        gl.uniform3fv(ddLoc, dd);

        var nHuruf = initBuffers(gl, verticeTriangle);

        flag = 1;
        gl.uniform1i(flagUniformLocation, flag);
        gl.uniform1i(fFlagUniformLocation, flag);
        gl.drawArrays(gl.TRIANGLES, 0, nHuruf);
        gl.disableVertexAttribArray(vColor);


        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        requestAnimationFrame(render);
    }

    function draw() {

        theta = 0;
        thetaSpeed = 0.0;

        // Definisi untuk matriks model
        mmLoc = gl.getUniformLocation(program, 'modelMatrix');
        mm = glMatrix.mat4.create();
        glMatrix.mat4.translate(mm, mm, [0.0, 0.0, -2.0]);

        // Definisi untuk matrix view dan projection
        vmLoc = gl.getUniformLocation(program, 'viewMatrix');
        vm = glMatrix.mat4.create();
        pmLoc = gl.getUniformLocation(program, 'projectionMatrix');
        pm = glMatrix.mat4.create();

        camera = { x: 0.0, y: 0.0, z: 0.0 };
        glMatrix.mat4.perspective(pm,
            glMatrix.glMatrix.toRadian(90), //fovy dalam radian
            canvas.width / canvas.height, //aspect ratio
            0.7, //near
            11.0, //far  
        );
        gl.uniformMatrix4fv(pmLoc, false, pm);

        xHurufLocation = gl.getUniformLocation(program, 'triangleX');
        triangleX = 0.0;
        gl.uniform1f(xHurufLocation, triangleX);

        yHurufLocation = gl.getUniformLocation(program, 'triangleY');
        triangleY = 0.0;
        gl.uniform1f(yHurufLocation, triangleY);

        zHurufLocation = gl.getUniformLocation(program, 'triangleZ');
        triangleZ = 0.0;
        gl.uniform1f(zHurufLocation, triangleZ);

        scaleXUniformLocation = gl.getUniformLocation(program, 'scaleX');
        scaleX = 1.0;
        gl.uniform1f(scaleXUniformLocation, scaleX);

        flagUniformLocation = gl.getUniformLocation(program, 'flag');
        flag = 0;
        gl.uniform1i(flagUniformLocation, flag);

        fFlagUniformLocation = gl.getUniformLocation(program, 'fFlag');
        gl.uniform1i(fFlagUniformLocation, flag);

        melebar = 1.0;
        arahX = 1.0;
        arahY = 1.0;
        arahZ = 1.0;

        dcLoc = gl.getUniformLocation(program, 'diffuseColor');
        dc = glMatrix.vec3.fromValues(1.0, 1.0, 1.0);
        gl.uniform3fv(dcLoc, dc);

        ddLoc = gl.getUniformLocation(program, 'diffusePosition');

        acLoc = gl.getUniformLocation(program, 'ambientColor');
        ac = glMatrix.vec3.fromValues(0.17, 0.40, 0.78); //05111740000078
        gl.uniform3fv(acLoc, ac);

        nmLoc = gl.getUniformLocation(program, 'normalMatrix');

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);

        render();
    }

    function main() {


        // Get canvas element and check if WebGL enabled
        canvas = document.getElementById("glcanvas");
        gl = glUtils.checkWebGL(canvas);
        var vertexShader = glUtils.getShader(gl, gl.VERTEX_SHADER, glUtils.SL.Shaders.v1.vertex);
        var fragmentShader = glUtils.getShader(gl, gl.FRAGMENT_SHADER, glUtils.SL.Shaders.v1.fragment);
        program = glUtils.createProgram(gl, vertexShader, fragmentShader);
        gl.useProgram(program);

        Quad(2, 3, 7, 6); //kanan
        Quad(3, 0, 4, 7); //bawah
        Quad(4, 5, 6, 7); //belakang
        Quad(5, 4, 0, 1); //kiri
        Quad(6, 5, 1, 2); //atas
        initTexture(gl);


        draw();

    }

})();