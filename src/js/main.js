let toggleThemeBtn;

let finderInput;
let finderSubmitBtn;

let cardAvatar, cardName, cardLogin, cardDateJoined;
let cardBio;
let cardRepos, cardFollowers, cardFollowing;
let cardLocation, cardBlog, cardTwitter, cardCompany;

const API_URL_BASE = 'https://api.github.com/users/';
const defaultUser = 'octocat';
const defaultBio = 'This profile has no bio.';
const defaultLinkText = 'Not Available';

const moonIcon = './dist/assets/icon-moon.svg';
const sunIcon = './dist/assets/icon-sun.svg';

const main = () => {
	setOnLoadTheme();
	prepareDOMElements();
	prepareDOMEvents();
	setToggleBtnTheme();
	loadDefaultUser();
};

const prepareDOMElements = () => {
	toggleThemeBtn = document.querySelector('.toggle-btn');

	finderInput = document.querySelector('#finder-input');
	finderSubmitBtn = document.querySelector('#finder-submit');

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
	console.log(finderInput.value);
	if (finderInput.value) loadUser(finderInput.value);
};

const loadDefaultUser = () => {
	loadUser(defaultUser);
};

const loadUser = (username) => {
	const url = `${API_URL_BASE}${username}`;
	fetch(url)
		.then((res) => {
			if (!res.ok) throw new Error('err');
			return res.json();
		})
		.then((res) => setData(res))
		.catch((error) => {
			//display error message
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
	cardBio.innerText = bio ? bio : defaultBio;
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
	cardLocation.innerText = location || defaultLinkText;
};

const setBlog = (blog) => {
	if (blog) {
		cardBlog.innerText = blog;
		cardBlog.setAttribute('href', blog.startsWith('https://') || blog.startsWith('http://') ? blog : `https://${blog}`);
		setBlankLink(cardBlog);
		return;
	}
	setDefaultLink(cardBlog);
};

const setTwitter = (username) => {
	if (username) {
		cardTwitter.innerText = `@${username}`;
		cardTwitter.setAttribute('href', `http://twitter.com/${username}`);
		setBlankLink(cardTwitter);
		return;
	}
	setDefaultLink(cardTwitter);
};

const setCompany = (company) => {
	if (company) {
		cardCompany.innerText = company;
		cardCompany.setAttribute('href', `https://github.com/${company.slice(1)}`);
		setBlankLink(cardCompany);
		return;
	}
	setDefaultLink(cardCompany);
};

const setBlankLink = (element) => {
	element.setAttribute('rel', 'noreferrer noopener');
	element.setAttribute('target', '_blank');
};

const setDefaultLink = (element) => {
	element.innerText = defaultLinkText;
	element.setAttribute('href', '#');
	element.removeAttribute('rel');
	element.removeAttribute('target');
};

// toggle theme button
const handleToggleBtn = () => {
	if (document.body.dataset.theme === 'light') document.body.dataset.theme = 'dark';
	else document.body.dataset.theme = 'light';

	setToggleBtnTheme();
};

const setToggleBtnTheme = () => {
	const toggleBtnText = toggleThemeBtn.querySelector('span');
	const toggleBtnIcon = toggleThemeBtn.querySelector('img');

	if (document.body.dataset.theme === 'light') {
		toggleBtnText.innerText = 'dark';
		toggleBtnIcon.src = moonIcon;
	} else {
		toggleBtnText.innerText = 'light';
		toggleBtnIcon.src = sunIcon;
	}
};

const setOnLoadTheme = () => {
	if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
		document.body.dataset.theme = 'dark';
	}
};

document.addEventListener('DOMContentLoaded', main);
