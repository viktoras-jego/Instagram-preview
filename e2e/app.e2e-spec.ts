import { InstagramPreviewPage } from './app.po';

describe('instagram-preview App', () => {
  let page: InstagramPreviewPage;

  beforeEach(() => {
    page = new InstagramPreviewPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
