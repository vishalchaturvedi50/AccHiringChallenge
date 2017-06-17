import { ChallengePage } from './app.po';

describe('challenge App', () => {
  let page: ChallengePage;

  beforeEach(() => {
    page = new ChallengePage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
