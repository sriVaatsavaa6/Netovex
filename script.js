document.addEventListener('DOMContentLoaded', function () {
    // Navbar scroll functionality
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');

    if (navbar) {
        window.addEventListener('scroll', function() {
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            if (scrollTop > lastScrollTop) {
                // Scrolling Down
                navbar.classList.add('hidden');
            } else {
                // Scrolling Up
                navbar.classList.remove('hidden');
            }

            lastScrollTop = scrollTop;
        });
    }
    // End navbar scroll functionality

    function generateUniqueId() {
        return 'NetovexID' + Math.floor(Math.random() * 1000000);
    }

    function resetToDefaultView() {
        document.getElementById('generated-id').textContent = "ID: NetovexIDxxxxxx";
        document.getElementById('card-name').textContent = "Your Name";
        document.getElementById('card-designation').textContent = "Your Designation";
        document.getElementById('card-company').textContent = "Your Company";
        document.getElementById('card-contact').textContent = "Your Contact";
        document.getElementById('card-website').textContent = "Your Website";

        const card = document.getElementById('business-card');
        card.style.fontFamily = "'Roboto', sans-serif";
        card.style.backgroundColor = "#FFFFFF";
        card.style.color = "#000000";

        document.querySelectorAll('.card-text').forEach(el => el.style.color = "#000000");

        document.getElementById('profile-pic').src = "";
        document.getElementById('qr-code').innerHTML = "";

        document.getElementById('name').value = "";
        document.getElementById('designation').value = "";
        document.getElementById('company').value = "";
        document.getElementById('contact').value = "";
        document.getElementById('website').value = "";
        document.getElementById('photo-upload').value = "";
        document.getElementById('bg-color').value = "#FFFFFF";
        document.getElementById('text-color').value = "#000000";
        document.getElementById('font-family').value = "'Roboto', sans-serif";
    }

    function storeInputData() {
        localStorage.setItem('name', document.getElementById('name').value || "Your Name");
        localStorage.setItem('designation', document.getElementById('designation').value || "Your Designation");
        localStorage.setItem('company', document.getElementById('company').value || "Your Company");
        localStorage.setItem('contact', document.getElementById('contact').value || "Your Contact");
        localStorage.setItem('website', document.getElementById('website').value || "Your Website");
        localStorage.setItem('fontFamily', document.getElementById('font-family').value || "'Roboto', sans-serif");
        localStorage.setItem('bgColor', document.getElementById('bg-color').value || "#FFFFFF");
        localStorage.setItem('textColor', document.getElementById('text-color').value || "#000000");
    }

    document.getElementById('generate').addEventListener('click', function () {
        storeInputData();

        if (!localStorage.getItem('generatedID') || localStorage.getItem('generatedID') === "NetovexIDxxxxxx") {
            const uniqueID = generateUniqueId();
            localStorage.setItem('generatedID', uniqueID);
        }

        updateCard(true);
    });

    function updateCard(forceNewQR = false) {
        document.getElementById('card-name').textContent = localStorage.getItem('name') || "Your Name";
        document.getElementById('card-designation').textContent = localStorage.getItem('designation') || "Your Designation";
        document.getElementById('card-company').textContent = localStorage.getItem('company') || "Your Company";
        document.getElementById('card-contact').textContent = localStorage.getItem('contact') || "Your Contact";
        document.getElementById('card-website').textContent = localStorage.getItem('website') || "Your Website";

        const card = document.getElementById('business-card');
        card.style.fontFamily = localStorage.getItem('fontFamily') || "'Roboto', sans-serif";
        card.style.backgroundColor = localStorage.getItem('bgColor') || "#FFFFFF";
        card.style.color = localStorage.getItem('textColor') || "#000000";

        const textColor = localStorage.getItem('textColor') || "#000000";
        document.querySelectorAll('.card-text').forEach(el => el.style.color = textColor);

        document.getElementById('generated-id').textContent = `ID: ${localStorage.getItem('generatedID') || "NetovexIDxxxxxx"}`;

        const savedPhoto = localStorage.getItem('profilePhoto');
        if (savedPhoto) {
            document.getElementById('profile-pic').src = savedPhoto;
        }

        if (forceNewQR) {
            generateNewQRCode();
        }
    }

    function generateNewQRCode() {
        const qrCodeContainer = document.getElementById('qr-code');
        qrCodeContainer.innerHTML = "";

        let randomToken = Math.random().toString(36).substr(2, 10);
        let websiteUrl = localStorage.getItem('website') || "Your Website";
        let qrData = websiteUrl + "?session=" + randomToken;

        console.log("Generating New QR Code for:", qrData);

        new QRCode(qrCodeContainer, {
            text: qrData,
            width: 100,
            height: 100,
            correctLevel: QRCode.CorrectLevel.H
        });
    }

    if (document.getElementById('card-name')) {
        updateCard();
    }

    document.getElementById("download").addEventListener("click", function () {
        let card = document.getElementById("business-card");
        let qrCanvas = document.querySelector("#qr-code canvas");

        if (qrCanvas) {
            let qrImage = new Image();
            qrImage.src = qrCanvas.toDataURL("image/png");

            let qrContainer = document.getElementById("qr-code");
            qrContainer.innerHTML = "";
            qrContainer.appendChild(qrImage);

            setTimeout(() => {
                html2canvas(card, {
                    scale: 4,
                    useCORS: true,
                    backgroundColor: null,
                }).then(canvas => {
                    let link = document.createElement("a");
                    link.download = "business-card.png";
                    link.href = canvas.toDataURL("image/png", 1.0);
                    link.click();

                    qrContainer.innerHTML = "";
                    qrContainer.appendChild(qrCanvas);

                }).catch(error => {
                    console.error('Error capturing card with html2canvas:', error);
                    qrContainer.innerHTML = "";
                    qrContainer.appendChild(qrCanvas);
                });
            }, 1000);
        } else {
            setTimeout(() => {
                html2canvas(card, {
                    scale: 4,
                    useCORS: true,
                    backgroundColor: null,
                }).then(canvas => {
                    let link = document.createElement("a");
                    link.download = "business-card.png";
                    link.href = canvas.toDataURL("image/png", 1.0);
                    link.click();

                }).catch(error => {
                    console.error('Error capturing card with html2canvas:', error);
                });
            }, 1000);
        }
    });

    document.getElementById('font-family').addEventListener('change', storeInputData);
    document.getElementById('bg-color').addEventListener('input', storeInputData);
    document.getElementById('text-color').addEventListener('input', storeInputData);

    // Modified photo-upload event listener
    document.getElementById('photo-upload').addEventListener('change', function (event) {
        const fileReader = new FileReader();
        fileReader.onload = function (e) {
            const base64Image = e.target.result;
            // Store the image in localStorage, but don't update the card yet
            localStorage.setItem('profilePhoto', base64Image);
        };
        fileReader.readAsDataURL(event.target.files[0]);
    });

    document.getElementById('reset').addEventListener('click', function () {
        localStorage.clear();
        resetToDefaultView();
        location.reload();
    });
});
