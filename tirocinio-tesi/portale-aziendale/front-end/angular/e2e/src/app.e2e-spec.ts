import {starterPage} from './app.po';

describe('starter App', () => {
    let page: starterPage;

    beforeEach(() => {
        page = new starterPage();
    });

    it('should display welcome message', () => {
        page.navigateTo();
        expect(page.getTitleText()).toEqual('Welcome to starter!');
    });
});
