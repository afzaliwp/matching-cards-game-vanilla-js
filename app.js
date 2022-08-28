class matchingCards {

    ACTIVE_CARD;
    WRONG_ANSWERS = 0;
    DEFAULT_SETTINGS = {
        wrapperId: 'game-wrapper',
        cardsClass: 'card',
        difficulty: 'easy',
        hideTime: 5000,
        gameRulesContainerId: 'game-rules'
    }

    constructor(settings = {}) {

        this.DEFAULT_SETTINGS = {
            ...this.DEFAULT_SETTINGS,
            ...settings,
        };


        this.initGame();
        this._addGameRulesToPage();
        this.cardClick();
    }

    initGame() {
        const cards = this.generateCards();
        const preparedCards = this.prepareCards(cards);
        const settings = this.DEFAULT_SETTINGS;

        preparedCards.map((card) => {
            document.getElementById(settings.wrapperId).appendChild(card);
        });

        this.flipAllCardsToBack();
    }

    getAllCreatedCards(wrapperId, cardsClass) {
        return document.querySelectorAll(`#${wrapperId} .${cardsClass}`);
    }

    generateCards() {
        const requiredCardsCount = this._difficultyCardsCount(this.DEFAULT_SETTINGS.difficulty) / 2;

        const cards = [];
        for (let i = 0; requiredCardsCount > i; i++) {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.show = 'front';
            card.dataset.cardId = `${i}`;

            const cardFront = this.generateCardChild('front');
            const cardBack = this.generateCardChild('back');

            card.appendChild(cardBack);
            card.appendChild(cardFront);

            cards.push(card);
        }

        return cards;
    }

    generateCardChild(side) {
        const cardChild = document.createElement('div');
        cardChild.classList.add(`card-${side}`);

        return cardChild;
    }

    _difficultyCardsCount(difficulty = 'easy') {
        const cardsCounts = {
            easy: 10,
            medium: 20,
            hard: 30
        }
        return cardsCounts[difficulty];
    }

    flipAllCardsToBack(instant = false) {
        const settings = this.DEFAULT_SETTINGS;
        const cards = this.getAllCreatedCards(settings.wrapperId, settings.cardsClass);

        if (instant) {
            cards.forEach((card) => {
                if (!card.dataset.ansewered || card.dataset.ansewered !== 'true') {
                    return card.dataset.show = 'back';
                }
            });

            return false;
        }

        setInterval(() => {
            cards.forEach((card) => {
                if (!card.dataset.ansewered && card.dataset.ansewered !== 'true') {
                    return card.dataset.show = 'back';
                }
            });
        }, settings.hideTime)

        return cards;
    }

    prepareCards(cards) {
        const allCards = this._duplicateElementsOfArray(cards);

        return this._shuffleArray(allCards);
    }

    _duplicateElementsOfArray(array) {
        return array.flatMap((item) => {
            const duplicateItem = item.cloneNode(true);

            return [item, duplicateItem]
        });
    }

    _shuffleArray(array) {
        let currentIndex = array.length, randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }

        return array;
    }

    cardClick() {
        const settings = this.DEFAULT_SETTINGS;

        document.body.addEventListener('click', event => {
            const cardNode = event.path[1];
            if (!cardNode.classList.contains(settings.cardsClass)) {
                return false;
            }

            if (this.ACTIVE_CARD) {
                if (this.ACTIVE_CARD === cardNode.dataset.cardId) {
                    return this.correctAnswer();
                }

                return this.wrongAnswer();
            }

            this.flipChosenCard(cardNode);
            this.ACTIVE_CARD = cardNode.dataset.cardId;
        })
    }

    flipCorrectCards(cardId) {
        const settings = this.DEFAULT_SETTINGS;
        const correctCards = document.querySelectorAll(`#${settings.wrapperId} .${settings.cardsClass}[data-card-id="${cardId}"]`);

        correctCards.forEach(card => {
            card.dataset.show = 'front';
            card.dataset.ansewered = 'true';
        })
    }

    correctAnswer() {
        this.flipCorrectCards(this.ACTIVE_CARD);
        return this.ACTIVE_CARD = null;
    }

    wrongAnswer() {
        this.WRONG_ANSWERS++;
        document.querySelector('.game-wrong-answers').innerText = this.WRONG_ANSWERS;
        this.flipAllCardsToBack(true);
        return this.ACTIVE_CARD = null;
    }


    flipChosenCard(cardNode) {
        cardNode.dataset.show = 'front';
        cardNode.dataset.ansewered = 'false';
    }

    _addGameRulesToPage() {
        const settings = this.DEFAULT_SETTINGS;
        const gameRulesContainerId = settings.gameRulesContainerId;
        document.getElementById(gameRulesContainerId).innerHTML = `Difficulty: ${settings.difficulty} | Hide time: ${settings.hideTime / 1000}s | Wrong answers: <span class="game-wrong-answers">0</span>`;
    }
}