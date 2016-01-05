module.exports = {showWelcome() {
	var options = {
		'bgcolor': '#0da6ec',
		'fontcolor': '#fff',
		'onOpened'() {
			console.log("welcome screen opened");
		},
		'onClosed'() {
			console.log("welcome screen closed");
		}
	},
	slides,
	welcomescreen;

	slides = [
		{
			id: 'slide0',
			picture: '<div class="tutorialicon">♥</div>',
			text: 'Welcome to this tutorial. In the <a class="tutorial-next-link" href="#">next steps</a> we will guide you through a manual that will teach you how to use this app.'
		},
		{
			id: 'slide1',
			picture: '<div class="tutorialicon">✲</div>',
			text: 'This is slide 2'
		},
		{
			id: 'slide2',
			picture: '<div class="tutorialicon">♫</div>',
			text: 'This is slide 3'
		},
		{
			id: 'slide3',
			picture: '<div class="tutorialicon">☆</div>',
			text: 'Thanks for reading! Enjoy this app or go to <a class="tutorial-previous-slide" href="#">previous slide</a>.<br><br><a class="tutorial-close-btn" href="#">Enter</a>'
		}
	];

	welcomescreen = app.welcomescreen(slides, options);

	$(document).on('click', '.tutorial-close-btn', ()=>{
		welcomescreen.close();
	});

	$('.tutorial-open-btn').click(()=>{
		welcomescreen.open();
	});

	$(document).on('click', '.tutorial-next-link', (e)=>{
		welcomescreen.next();
	});

	$(document).on('click', '.tutorial-previous-slide', (e)=>{
		welcomescreen.previous();
	});
}};
