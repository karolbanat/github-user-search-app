let toggleThemeBtn;

let finderInput;
let finderSubmitBtn;
let finderError;

let cardAvatar, cardName, cardLogin, cardDateJoined;
let cardBio;
let cardRepos, cardFollowers, cardFollowing;
let cardLocation, cardBlog, cardTwitter, cardCompany;

const API_URL_BASE = 'https://api.github.com/users/';
const TWITTER_URL_BASE = 'http://twitter.com/';
const GITHUB_URL_BASE = 'https://github.com/';

const DEFAULT_USERNAME = 'octocat';
const DEFAULT_BIO = 'This profile has no bio.';
const DEFAULT_LINK_TEXT = 'Not Available';

const MOON_ICON = './dist/assets/icon-moon.svg';
const SUN_ICON = './dist/assets/icon-sun.svg';

const main = () => {
	prepareDOMElements();
	prepareDOMEvents();
	setOnLoadTheme();
	setToggleBtnTheme();
	loadDefaultUser();
};

const prepareDOMElements = () => {
	toggleThemeBtn = document.querySelector('.toggle-btn');

	finderInput = document.querySelector('#finder-input');
	finderSubmitBtn = document.querySelector('#finder-submit');
	finderError = document.querySelector('#finder-error');

	cardAvatar = document.querySelector('#card-avatar');
	cardName = document.querySelector('#card-name');
	cardLogin = document.querySelector('#card-login');
	cardDateJoined = document.querySelector('#card-date-joined');

	cardBio = document.querySelector('#card-bio');
	cardRepos = document.querySelector('#card-repos');
	cardFollowers = document.querySelector('#card-followers');
	cardFollowing = document.querySelector('#card-following');

	cardLocation = document.querySelector('#card-location');
	cardBlog = document.querySelector('#card-blog');
	cardTwitter = document.querySelector('#card-twitter');
	cardCompany = document.querySelector('#card-company');
};

const prepareDOMEvents = () => {
	toggleThemeBtn.addEventListener('click', handleToggleBtn);
	finderSubmitBtn.addEventListener('click', handleFinderSubmit);
};

// finder data setting
const handleFinderSubmit = (e) => {
	e.preventDefault();
	finderError.removeAttribute('data-visible');
	if (finderInput.value) loadUser(finderInput.value);
};

const loadDefaultUser = () => {
	loadUser(DEFAULT_USERNAME);
};

const loadUser = (username) => {
	const url = `${API_URL_BASE}${username}`;
	fetch(url)
		.then((res) => {
			if (!res.ok) throw new Error();
			return res.json();
		})
		.then((res) => setData(res))
		.catch((error) => {
			finderError.setAttribute('data-visible', 'visible');
		});
};

const setData = ({
	avatar_url,
	name,
	login,
	created_at,
	bio,
	public_repos,
	followers,
	following,
	location,
	blog,
	twitter_username,
	company,
} = {}) => {
	setAvatar(avatar_url, name);
	setName(name);
	setLogin(login, name);
	setDateJoined(created_at);
	setBio(bio);
	setStatistics(public_repos, followers, following);
	setLocation(location);
	setBlog(blog);
	setTwitter(twitter_username);
	setCompany(company);
};

const setAvatar = (avatar_url, name) => {
	cardAvatar.src = avatar_url;
	cardAvatar.alt = name;
};

const setName = (name) => {
	cardName.innerText = name;
};

const setLogin = (login, name) => {
	const userLogin = login ? login : formatName(name);
	cardLogin.innerText = `@${userLogin}`;
};

const formatName = (name) => {
	return name.toLowerCase().split(' ').join('');
};

const setDateJoined = (created_at) => {
	const date = new Date(created_at);
	const year = date.getFullYear();
	const monthNumber = date.getMonth() + 1;
	const month = getMonth(monthNumber - 1);
	const day = date.getDate();
	cardDateJoined.innerText = `${day} ${month} ${year}`;
	cardDateJoined.setAttribute('datetime', `${year}-${formatMonthNumber(monthNumber)}-${day}`);
};

const getMonth = (month) => {
	const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	return months[month];
};

const formatMonthNumber = (monthNumber) => {
	const prefix = monthNumber < 10 ? '0' : '';
	return `${prefix}${monthNumber}`;
};

const setBio = (bio) => {
	if (bio) {
		cardBio.innerText = bio;
		cardBio.classList.remove('faded');
		return;
	}
	cardBio.innerText = DEFAULT_BIO;
	cardBio.classList.add('faded');
};

const setStatistics = (repos, followers, following) => {
	setRepos(repos);
	setFollowers(followers);
	setFollowing(following);
};

const setRepos = (repos) => {
	cardRepos.innerText = repos;
};

const setFollowers = (followers) => {
	cardFollowers.innerText = followers;
};

const setFollowing = (following) => {
	cardFollowing.innerText = following;
};

const setLocation = (location) => {
	if (location) {
		cardLocation.innerText = location;
		cardLocation.classList.remove('faded');
	}
	cardLocation.innerText = DEFAULT_LINK_TEXT;
	cardLocation.classList.add('faded');
};

const setBlog = (blog) => {
	if (blog) {
		cardBlog.innerText = blog;
		cardBlog.setAttribute('href', blog.startsWith('https://') || blog.startsWith('http://') ? blog : `https://${blog}`);
		setBlankLink(cardBlog);
		cardBlog.classList.remove('faded');
		return;
	}
	setDefaultLink(cardBlog);
};

const setTwitter = (username) => {
	if (username) {
		cardTwitter.innerText = `@${username}`;
		cardTwitter.setAttribute('href', `${TWITTER_URL_BASE}${username}`);
		setBlankLink(cardTwitter);
		cardTwitter.classList.remove('faded');
		return;
	}
	setDefaultLink(cardTwitter);
};

const setCompany = (company) => {
	if (company) {
		cardCompany.innerText = company;
		cardCompany.setAttribute('href', `${GITHUB_URL_BASE}${company.startsWith('@') ? company.slice(1) : company}`);
		setBlankLink(cardCompany);
		cardCompany.classList.remove('faded');
		return;
	}
	setDefaultLink(cardCompany);
};

const setBlankLink = (element) => {
	element.setAttribute('rel', 'noreferrer noopener');
	element.setAttribute('target', '_blank');
};

const setDefaultLink = (element) => {
	element.innerText = DEFAULT_LINK_TEXT;
	element.setAttribute('href', '#');
	element.removeAttribute('rel');
	element.removeAttribute('target');
	element.classList.add('faded');
};

// toggle theme button
const handleToggleBtn = () => {
	if (document.body.dataset.theme === 'light') {
		document.body.dataset.theme = 'dark';
	} else {
		document.body.dataset.theme = 'light';
	}

	setToggleBtnTheme();
};

const setToggleBtnTheme = () => {
	const toggleBtnText = toggleThemeBtn.querySelector('span');
	const toggleBtnIcon = toggleThemeBtn.querySelector('img');

	if (document.body.dataset.theme === 'light') {
		toggleBtnText.innerText = 'dark';
		toggleBtnIcon.src = MOON_ICON;
	} else {
		toggleBtnText.innerText = 'light';
		toggleBtnIcon.src = SUN_ICON;
	}
};

const setOnLoadTheme = () => {
	if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
		document.body.dataset.theme = 'dark';
	}
};

document.addEventListener('DOMContentLoaded', main);
