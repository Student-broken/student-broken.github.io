document.addEventListener('DOMContentLoaded', function() {
    // 1. Be able to read and write in the cache. It should check if the user has a local storage with the key: "mbs_accept" that has 2 boolean: "terms" and "privacy"
    const checkLocalStorage = () => {
        const storedData = localStorage.getItem('mbs_accept');
        if (storedData) {
            try {
                const parsedData = JSON.parse(storedData);
                return parsedData.terms === true && parsedData.privacy === true;
            } catch (e) {
                return false;
            }
        }
        return false;
    };

    // 2. If the user does have that as true, then do nothing
    if (checkLocalStorage()) {
        return;
    }

    // 3. If user has that as false, or is empty, then pop up the widget.
    const createWidget = () => {
        const widgetContainer = document.createElement('div');
        widgetContainer.id = 'mbs-widget-container';
        widgetContainer.style.position = 'fixed';
        widgetContainer.style.top = '0';
        widgetContainer.style.left = '0';
        widgetContainer.style.width = '100%';
        widgetContainer.style.height = '100%';
        widgetContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        widgetContainer.style.display = 'flex';
        widgetContainer.style.justifyContent = 'center';
        widgetContainer.style.alignItems = 'center';
        widgetContainer.style.zIndex = '10000';

        const widgetContent = document.createElement('div');
        widgetContent.style.backgroundColor = 'white';
        widgetContent.style.padding = '20px';
        widgetContent.style.borderRadius = '5px';
        widgetContent.style.textAlign = 'center';
        widgetContent.style.maxWidth = '500px';

        // 4. The widget should have no other way to close, unless the user accepts. There should be the tittle of the site in big. Outil MBS
        const title = document.createElement('h1');
        title.textContent = 'Outil MBS';
        title.style.fontSize = '2em';

        // 5. Under that, in bright red, Have it say "OUTIL MBS ne collecte aucune information personnelle sensible. Tous les calculs s’effectuent localement dans votre navigateur ; aucun mot de passe ni nom d’utilisateur n’est requis."
        const warningMessage = document.createElement('p');
        warningMessage.innerHTML = '<b>OUTIL MBS ne collecte aucune information personnelle sensible.</b> Tous les calculs s’effectuent localement dans votre navigateur ; aucun mot de passe ni nom d’utilisateur n’est requis.';
        warningMessage.style.color = 'red';
        warningMessage.style.fontWeight = 'bold';

        // 6. Explicitly display that this website also do not collect passwords, names, or usernames.
        const noDataCollectionMessage = document.createElement('p');
        noDataCollectionMessage.textContent = 'Ce site ne collecte ni mots de passe, ni noms, ni noms d’utilisateur.';

        // 8. There should be a checkmark with terms and conditions which the user must check to press the button
        const termsContainer = document.createElement('div');
        termsContainer.style.margin = '20px 0';

        const termsCheckbox = document.createElement('input');
        termsCheckbox.type = 'checkbox';
        termsCheckbox.id = 'mbs-terms';

        const termsLabel = document.createElement('label');
        termsLabel.htmlFor = 'mbs-terms';
        termsLabel.innerHTML = ' J\'accepte les <a href="info/condition.html" target="_blank">termes et conditions</a>';

        const privacyCheckbox = document.createElement('input');
        privacyCheckbox.type = 'checkbox';
        privacyCheckbox.id = 'mbs-privacy';

        const privacyLabel = document.createElement('label');
        privacyLabel.htmlFor = 'mbs-privacy';
        privacyLabel.innerHTML = ' et la <a href="info/privacy.html" target="_blank">politique de confidentialité</a>.';

        termsContainer.appendChild(termsCheckbox);
        termsContainer.appendChild(termsLabel);
        termsContainer.appendChild(privacyCheckbox);
        termsContainer.appendChild(privacyLabel);

        const acceptButton = document.createElement('button');
        acceptButton.textContent = 'Accepter';
        acceptButton.disabled = true;

        const checkCheckboxes = () => {
            acceptButton.disabled = !(termsCheckbox.checked && privacyCheckbox.checked);
        };

        termsCheckbox.addEventListener('change', checkCheckboxes);
        privacyCheckbox.addEventListener('change', checkCheckboxes);

        acceptButton.addEventListener('click', () => {
            localStorage.setItem('mbs_accept', JSON.stringify({ terms: true, privacy: true }));
            document.body.removeChild(widgetContainer);
        });

        // 9. If the user should have a pop up over that pop up as an iframe, displaying the faq.html.
        const faqLink = document.createElement('a');
        faqLink.href = '#';
        faqLink.textContent = 'FAQ';
        faqLink.style.display = 'block';
        faqLink.style.marginTop = '10px';

        const faqIframeContainer = document.createElement('div');
        faqIframeContainer.style.position = 'fixed';
        faqIframeContainer.style.top = '0';
        faqIframeContainer.style.left = '0';
        faqIframeContainer.style.width = '100%';
        faqIframeContainer.style.height = '100%';
        faqIframeContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        faqIframeContainer.style.display = 'none';
        faqIframeContainer.style.justifyContent = 'center';
        faqIframeContainer.style.alignItems = 'center';
        faqIframeContainer.style.zIndex = '10001';

        const faqIframe = document.createElement('iframe');
        faqIframe.src = 'info/faq.html';
        faqIframe.style.width = '80%';
        faqIframe.style.height = '80%';
        faqIframe.style.backgroundColor = 'white';
        faqIframe.style.border = 'none';

        const closeIframeButton = document.createElement('button');
        closeIframeButton.textContent = 'Fermer';
        closeIframeButton.style.position = 'absolute';
        closeIframeButton.style.top = '10px';
        closeIframeButton.style.right = '10px';

        faqIframeContainer.appendChild(faqIframe);
        faqIframeContainer.appendChild(closeIframeButton);

        faqLink.addEventListener('click', (e) => {
            e.preventDefault();
            faqIframeContainer.style.display = 'flex';
        });

        closeIframeButton.addEventListener('click', () => {
            faqIframeContainer.style.display = 'none';
        });

        widgetContent.appendChild(title);
        widgetContent.appendChild(warningMessage);
        widgetContent.appendChild(noDataCollectionMessage);
        widgetContent.appendChild(termsContainer);
        widgetContent.appendChild(acceptButton);
        widgetContent.appendChild(faqLink);
        widgetContainer.appendChild(widgetContent);
        widgetContainer.appendChild(faqIframeContainer);
        document.body.appendChild(widgetContainer);
    };

    createWidget();
});
