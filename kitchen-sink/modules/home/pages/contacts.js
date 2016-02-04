var React = require('react');
var UI = require('UI');
var _ = require('underscore');

var List = UI.List;
var Content = UI.Content;
var Icon = UI.Icon.Icon;
var Badge = UI.Badge.Badge;
var Form = UI.Form;
var View = UI.View;


var users = {
	A:[{name:"Aaron ",avatar:2}, {name:"Abbie",avatar:3}, {name:"Adam",avatar:4}, {name:"Adele",avatar:5}, {name:"Agatha",avatar:6}, {name:"Agnes",avatar:7}, {name:"Albert",avatar:8}, {name:"Alexander",avatar:9}, {name:"Aailey",avatar:1}, {name:"Aarclay",avatar:2}, {name:"Aartolo",avatar:3}, {name:"Aellamy",avatar:4}, {name:"Aelle",avatar:5}, {name:"Aenjamin",avatar:6}, {name:"Aaiden",avatar:7}, {name:"Aalvin",avatar:8}, {name:"Aandy",avatar:9}, {name:"Aarl",avatar:1}, {name:"Aherilyn",avatar:2}, {name:"Ahester",avatar:3}, {name:"Ahloe",avatar:4}, {name:"Aladimir",avatar:5}],
	B:[{name:"Baron ",avatar:2}, {name:"Bbbie",avatar:3}, {name:"Bdam",avatar:4}, {name:"Bdele",avatar:5}, {name:"Bgatha",avatar:6}, {name:"Bgnes",avatar:7}, {name:"Blbert",avatar:8}, {name:"Blexander",avatar:9}, {name:"Bailey",avatar:1}, {name:"Barclay",avatar:2}, {name:"Bartolo",avatar:3}, {name:"Bellamy",avatar:4}, {name:"Belle",avatar:5}, {name:"Benjamin",avatar:6}, {name:"Baiden",avatar:7}, {name:"Balvin",avatar:8}, {name:"Bandy",avatar:9}, {name:"Barl",avatar:1}, {name:"Bherilyn",avatar:2}, {name:"Bhester",avatar:3}, {name:"Bhloe",avatar:4}, {name:"Bladimir",avatar:5}],
	C:[{name:"Caron ",avatar:2}, {name:"Cbbie",avatar:3}, {name:"Cdam",avatar:4}, {name:"Cdele",avatar:5}, {name:"Cgatha",avatar:6}, {name:"Cgnes",avatar:7}, {name:"Clbert",avatar:8}, {name:"Clexander",avatar:9}, {name:"Cailey",avatar:1}, {name:"Carclay",avatar:2}, {name:"Cartolo",avatar:3}, {name:"Cellamy",avatar:4}, {name:"Celle",avatar:5}, {name:"Cenjamin",avatar:6}, {name:"Caiden",avatar:7}, {name:"Calvin",avatar:8}, {name:"Candy",avatar:9}, {name:"Carl",avatar:1}, {name:"Cherilyn",avatar:2}, {name:"Chester",avatar:3}, {name:"Chloe",avatar:4}, {name:"Cladimir",avatar:5}],
	D:[{name:"Daron ",avatar:2}, {name:"Dbbie",avatar:3}, {name:"Ddam",avatar:4}, {name:"Ddele",avatar:5}, {name:"Dgatha",avatar:6}, {name:"Dgnes",avatar:7}, {name:"Dlbert",avatar:8}, {name:"Dlexander",avatar:9}, {name:"Dailey",avatar:1}, {name:"Darclay",avatar:2}, {name:"Dartolo",avatar:3}, {name:"Dellamy",avatar:4}, {name:"Delle",avatar:5}, {name:"Denjamin",avatar:6}, {name:"Daiden",avatar:7}, {name:"Dalvin",avatar:8}, {name:"Dandy",avatar:9}, {name:"Darl",avatar:1}, {name:"Dherilyn",avatar:2}, {name:"Dhester",avatar:3}, {name:"Dhloe",avatar:4}, {name:"Dladimir",avatar:5}],
	E:[{name:"Earon ",avatar:2}, {name:"Ebbie",avatar:3}, {name:"Edam",avatar:4}, {name:"Edele",avatar:5}, {name:"Egatha",avatar:6}, {name:"Egnes",avatar:7}, {name:"Elbert",avatar:8}, {name:"Elexander",avatar:9}, {name:"Eailey",avatar:1}, {name:"Earclay",avatar:2}, {name:"Eartolo",avatar:3}, {name:"Eellamy",avatar:4}, {name:"Eelle",avatar:5}, {name:"Eenjamin",avatar:6}, {name:"Eaiden",avatar:7}, {name:"Ealvin",avatar:8}, {name:"Eandy",avatar:9}, {name:"Earl",avatar:1}, {name:"Eherilyn",avatar:2}, {name:"Ehester",avatar:3}, {name:"Ehloe",avatar:4}, {name:"Eladimir",avatar:5}],
	F:[{name:"Faron ",avatar:2}, {name:"Fbbie",avatar:3}, {name:"Fdam",avatar:4}, {name:"Fdele",avatar:5}, {name:"Fgatha",avatar:6}, {name:"Fgnes",avatar:7}, {name:"Flbert",avatar:8}, {name:"Flexander",avatar:9}, {name:"Failey",avatar:1}, {name:"Farclay",avatar:2}, {name:"Fartolo",avatar:3}, {name:"Fellamy",avatar:4}, {name:"Felle",avatar:5}, {name:"Fenjamin",avatar:6}, {name:"Faiden",avatar:7}, {name:"Falvin",avatar:8}, {name:"Fandy",avatar:9}, {name:"Farl",avatar:1}, {name:"Fherilyn",avatar:2}, {name:"Fhester",avatar:3}, {name:"Fhloe",avatar:4}, {name:"Fladimir",avatar:5}],
	G:[{name:"Garon ",avatar:2}, {name:"Gbbie",avatar:3}, {name:"Gdam",avatar:4}, {name:"Gdele",avatar:5}, {name:"Ggatha",avatar:6}, {name:"Ggnes",avatar:7}, {name:"Glbert",avatar:8}, {name:"Glexander",avatar:9}, {name:"Gailey",avatar:1}, {name:"Garclay",avatar:2}, {name:"Gartolo",avatar:3}, {name:"Gellamy",avatar:4}, {name:"Gelle",avatar:5}, {name:"Genjamin",avatar:6}, {name:"Gaiden",avatar:7}, {name:"Galvin",avatar:8}, {name:"Gandy",avatar:9}, {name:"Garl",avatar:1}, {name:"Gherilyn",avatar:2}, {name:"Ghester",avatar:3}, {name:"Ghloe",avatar:4}, {name:"Gladimir",avatar:5}],
	H:[{name:"Haron ",avatar:2}, {name:"Hbbie",avatar:3}, {name:"Hdam",avatar:4}, {name:"Hdele",avatar:5}, {name:"Hgatha",avatar:6}, {name:"Hgnes",avatar:7}, {name:"Hlbert",avatar:8}, {name:"Hlexander",avatar:9}, {name:"Hailey",avatar:1}, {name:"Harclay",avatar:2}, {name:"Hartolo",avatar:3}, {name:"Hellamy",avatar:4}, {name:"Helle",avatar:5}, {name:"Henjamin",avatar:6}, {name:"Haiden",avatar:7}, {name:"Halvin",avatar:8}, {name:"Handy",avatar:9}, {name:"Harl",avatar:1}, {name:"Hherilyn",avatar:2}, {name:"Hhester",avatar:3}, {name:"Hhloe",avatar:4}, {name:"Hladimir",avatar:5}],
	I:[{name:"Iaron ",avatar:2}, {name:"Ibbie",avatar:3}, {name:"Idam",avatar:4}, {name:"Idele",avatar:5}, {name:"Igatha",avatar:6}, {name:"Ignes",avatar:7}, {name:"Ilbert",avatar:8}, {name:"Ilexander",avatar:9}, {name:"Iailey",avatar:1}, {name:"Iarclay",avatar:2}, {name:"Iartolo",avatar:3}, {name:"Iellamy",avatar:4}, {name:"Ielle",avatar:5}, {name:"Ienjamin",avatar:6}, {name:"Iaiden",avatar:7}, {name:"Ialvin",avatar:8}, {name:"Iandy",avatar:9}, {name:"Iarl",avatar:1}, {name:"Iherilyn",avatar:2}, {name:"Ihester",avatar:3}, {name:"Ihloe",avatar:4}, {name:"Iladimir",avatar:5}],
	J:[{name:"Jaron ",avatar:2}, {name:"Jbbie",avatar:3}, {name:"Jdam",avatar:4}, {name:"Jdele",avatar:5}, {name:"Jgatha",avatar:6}, {name:"Jgnes",avatar:7}, {name:"Jlbert",avatar:8}, {name:"Jlexander",avatar:9}, {name:"Jailey",avatar:1}, {name:"Jarclay",avatar:2}, {name:"Jartolo",avatar:3}, {name:"Jellamy",avatar:4}, {name:"Jelle",avatar:5}, {name:"Jenjamin",avatar:6}, {name:"Jaiden",avatar:7}, {name:"Jalvin",avatar:8}, {name:"Jandy",avatar:9}, {name:"Jarl",avatar:1}, {name:"Jherilyn",avatar:2}, {name:"Jhester",avatar:3}, {name:"Jhloe",avatar:4}, {name:"Jladimir",avatar:5}],
	K:[{name:"Karon ",avatar:2}, {name:"Kbbie",avatar:3}, {name:"Kdam",avatar:4}, {name:"Kdele",avatar:5}, {name:"Kgatha",avatar:6}, {name:"Kgnes",avatar:7}, {name:"Klbert",avatar:8}, {name:"Klexander",avatar:9}, {name:"Kailey",avatar:1}, {name:"Karclay",avatar:2}, {name:"Kartolo",avatar:3}, {name:"Kellamy",avatar:4}, {name:"Kelle",avatar:5}, {name:"Kenjamin",avatar:6}, {name:"Kaiden",avatar:7}, {name:"Kalvin",avatar:8}, {name:"Kandy",avatar:9}, {name:"Karl",avatar:1}, {name:"Kherilyn",avatar:2}, {name:"Khester",avatar:3}, {name:"Khloe",avatar:4}, {name:"Kladimir",avatar:5}],
	L:[{name:"Laron ",avatar:2}, {name:"Lbbie",avatar:3}, {name:"Ldam",avatar:4}, {name:"Ldele",avatar:5}, {name:"Lgatha",avatar:6}, {name:"Lgnes",avatar:7}, {name:"Llbert",avatar:8}, {name:"Llexander",avatar:9}, {name:"Lailey",avatar:1}, {name:"Larclay",avatar:2}, {name:"Lartolo",avatar:3}, {name:"Lellamy",avatar:4}, {name:"Lelle",avatar:5}, {name:"Lenjamin",avatar:6}, {name:"Laiden",avatar:7}, {name:"Lalvin",avatar:8}, {name:"Landy",avatar:9}, {name:"Larl",avatar:1}, {name:"Lherilyn",avatar:2}, {name:"Lhester",avatar:3}, {name:"Lhloe",avatar:4}, {name:"Lladimir",avatar:5}],
	M:[{name:"Maron ",avatar:2}, {name:"Mbbie",avatar:3}, {name:"Mdam",avatar:4}, {name:"Mdele",avatar:5}, {name:"Mgatha",avatar:6}, {name:"Mgnes",avatar:7}, {name:"Mlbert",avatar:8}, {name:"Mlexander",avatar:9}, {name:"Mailey",avatar:1}, {name:"Marclay",avatar:2}, {name:"Martolo",avatar:3}, {name:"Mellamy",avatar:4}, {name:"Melle",avatar:5}, {name:"Menjamin",avatar:6}, {name:"Maiden",avatar:7}, {name:"Malvin",avatar:8}, {name:"Mandy",avatar:9}, {name:"Marl",avatar:1}, {name:"Mherilyn",avatar:2}, {name:"Mhester",avatar:3}, {name:"Mhloe",avatar:4}, {name:"Mladimir",avatar:5}],
	N:[{name:"Naron ",avatar:2}, {name:"Nbbie",avatar:3}, {name:"Ndam",avatar:4}, {name:"Ndele",avatar:5}, {name:"Ngatha",avatar:6}, {name:"Ngnes",avatar:7}, {name:"Nlbert",avatar:8}, {name:"Nlexander",avatar:9}, {name:"Nailey",avatar:1}, {name:"Narclay",avatar:2}, {name:"Nartolo",avatar:3}, {name:"Nellamy",avatar:4}, {name:"Nelle",avatar:5}, {name:"Nenjamin",avatar:6}, {name:"Naiden",avatar:7}, {name:"Nalvin",avatar:8}, {name:"Nandy",avatar:9}, {name:"Narl",avatar:1}, {name:"Nherilyn",avatar:2}, {name:"Nhester",avatar:3}, {name:"Nhloe",avatar:4}, {name:"Nladimir",avatar:5}],
	O:[{name:"Oaron ",avatar:2}, {name:"Obbie",avatar:3}, {name:"Odam",avatar:4}, {name:"Odele",avatar:5}, {name:"Ogatha",avatar:6}, {name:"Ognes",avatar:7}, {name:"Olbert",avatar:8}, {name:"Olexander",avatar:9}, {name:"Oailey",avatar:1}, {name:"Oarclay",avatar:2}, {name:"Oartolo",avatar:3}, {name:"Oellamy",avatar:4}, {name:"Oelle",avatar:5}, {name:"Oenjamin",avatar:6}, {name:"Oaiden",avatar:7}, {name:"Oalvin",avatar:8}, {name:"Oandy",avatar:9}, {name:"Oarl",avatar:1}, {name:"Oherilyn",avatar:2}, {name:"Ohester",avatar:3}, {name:"Ohloe",avatar:4}, {name:"Oladimir",avatar:5}],
	P:[{name:"Paron ",avatar:2}, {name:"Pbbie",avatar:3}, {name:"Pdam",avatar:4}, {name:"Pdele",avatar:5}, {name:"Pgatha",avatar:6}, {name:"Pgnes",avatar:7}, {name:"Plbert",avatar:8}, {name:"Plexander",avatar:9}, {name:"Pailey",avatar:1}, {name:"Parclay",avatar:2}, {name:"Partolo",avatar:3}, {name:"Pellamy",avatar:4}, {name:"Pelle",avatar:5}, {name:"Penjamin",avatar:6}, {name:"Paiden",avatar:7}, {name:"Palvin",avatar:8}, {name:"Pandy",avatar:9}, {name:"Parl",avatar:1}, {name:"Pherilyn",avatar:2}, {name:"Phester",avatar:3}, {name:"Phloe",avatar:4}, {name:"Pladimir",avatar:5}],
	Q:[{name:"Qaron ",avatar:2}, {name:"Qbbie",avatar:3}, {name:"Qdam",avatar:4}, {name:"Qdele",avatar:5}, {name:"Qgatha",avatar:6}, {name:"Qgnes",avatar:7}, {name:"Qlbert",avatar:8}, {name:"Qlexander",avatar:9}, {name:"Qailey",avatar:1}, {name:"Qarclay",avatar:2}, {name:"Qartolo",avatar:3}, {name:"Qellamy",avatar:4}, {name:"Qelle",avatar:5}, {name:"Qenjamin",avatar:6}, {name:"Qaiden",avatar:7}, {name:"Qalvin",avatar:8}, {name:"Qandy",avatar:9}, {name:"Qarl",avatar:1}, {name:"Qherilyn",avatar:2}, {name:"Qhester",avatar:3}, {name:"Qhloe",avatar:4}, {name:"Qladimir",avatar:5}],
	R:[{name:"Raron ",avatar:2}, {name:"Rbbie",avatar:3}, {name:"Rdam",avatar:4}, {name:"Rdele",avatar:5}, {name:"Rgatha",avatar:6}, {name:"Rgnes",avatar:7}, {name:"Rlbert",avatar:8}, {name:"Rlexander",avatar:9}, {name:"Railey",avatar:1}, {name:"Rarclay",avatar:2}, {name:"Rartolo",avatar:3}, {name:"Rellamy",avatar:4}, {name:"Relle",avatar:5}, {name:"Renjamin",avatar:6}, {name:"Raiden",avatar:7}, {name:"Ralvin",avatar:8}, {name:"Randy",avatar:9}, {name:"Rarl",avatar:1}, {name:"Rherilyn",avatar:2}, {name:"Rhester",avatar:3}, {name:"Rhloe",avatar:4}, {name:"Rladimir",avatar:5}],
	S:[{name:"Saron ",avatar:2}, {name:"Sbbie",avatar:3}, {name:"Sdam",avatar:4}, {name:"Sdele",avatar:5}, {name:"Sgatha",avatar:6}, {name:"Sgnes",avatar:7}, {name:"Slbert",avatar:8}, {name:"Slexander",avatar:9}, {name:"Sailey",avatar:1}, {name:"Sarclay",avatar:2}, {name:"Sartolo",avatar:3}, {name:"Sellamy",avatar:4}, {name:"Selle",avatar:5}, {name:"Senjamin",avatar:6}, {name:"Saiden",avatar:7}, {name:"Salvin",avatar:8}, {name:"Sandy",avatar:9}, {name:"Sarl",avatar:1}, {name:"Sherilyn",avatar:2}, {name:"Shester",avatar:3}, {name:"Shloe",avatar:4}, {name:"Sladimir",avatar:5}],
	T:[{name:"Taron ",avatar:2}, {name:"Tbbie",avatar:3}, {name:"Tdam",avatar:4}, {name:"Tdele",avatar:5}, {name:"Tgatha",avatar:6}, {name:"Tgnes",avatar:7}, {name:"Tlbert",avatar:8}, {name:"Tlexander",avatar:9}, {name:"Tailey",avatar:1}, {name:"Tarclay",avatar:2}, {name:"Tartolo",avatar:3}, {name:"Tellamy",avatar:4}, {name:"Telle",avatar:5}, {name:"Tenjamin",avatar:6}, {name:"Taiden",avatar:7}, {name:"Talvin",avatar:8}, {name:"Tandy",avatar:9}, {name:"Tarl",avatar:1}, {name:"Therilyn",avatar:2}, {name:"Thester",avatar:3}, {name:"Thloe",avatar:4}, {name:"Tladimir",avatar:5}],
	U:[{name:"Uaron ",avatar:2}, {name:"Ubbie",avatar:3}, {name:"Udam",avatar:4}, {name:"Udele",avatar:5}, {name:"Ugatha",avatar:6}, {name:"Ugnes",avatar:7}, {name:"Ulbert",avatar:8}, {name:"Ulexander",avatar:9}, {name:"Uailey",avatar:1}, {name:"Uarclay",avatar:2}, {name:"Uartolo",avatar:3}, {name:"Uellamy",avatar:4}, {name:"Uelle",avatar:5}, {name:"Uenjamin",avatar:6}, {name:"Uaiden",avatar:7}, {name:"Ualvin",avatar:8}, {name:"Uandy",avatar:9}, {name:"Uarl",avatar:1}, {name:"Uherilyn",avatar:2}, {name:"Uhester",avatar:3}, {name:"Uhloe",avatar:4}, {name:"Uladimir",avatar:5}],
	V:[{name:"Varon ",avatar:2}, {name:"Vbbie",avatar:3}, {name:"Vdam",avatar:4}, {name:"Vdele",avatar:5}, {name:"Vgatha",avatar:6}, {name:"Vgnes",avatar:7}, {name:"Vlbert",avatar:8}, {name:"Vlexander",avatar:9}, {name:"Vailey",avatar:1}, {name:"Varclay",avatar:2}, {name:"Vartolo",avatar:3}, {name:"Vellamy",avatar:4}, {name:"Velle",avatar:5}, {name:"Venjamin",avatar:6}, {name:"Vaiden",avatar:7}, {name:"Valvin",avatar:8}, {name:"Vandy",avatar:9}, {name:"Varl",avatar:1}, {name:"Vherilyn",avatar:2}, {name:"Vhester",avatar:3}, {name:"Vhloe",avatar:4}, {name:"Vladimir",avatar:5}],
	W:[{name:"Waron ",avatar:2}, {name:"Wbbie",avatar:3}, {name:"Wdam",avatar:4}, {name:"Wdele",avatar:5}, {name:"Wgatha",avatar:6}, {name:"Wgnes",avatar:7}, {name:"Wlbert",avatar:8}, {name:"Wlexander",avatar:9}, {name:"Wailey",avatar:1}, {name:"Warclay",avatar:2}, {name:"Wartolo",avatar:3}, {name:"Wellamy",avatar:4}, {name:"Welle",avatar:5}, {name:"Wenjamin",avatar:6}, {name:"Waiden",avatar:7}, {name:"Walvin",avatar:8}, {name:"Wandy",avatar:9}, {name:"Warl",avatar:1}, {name:"Wherilyn",avatar:2}, {name:"Whester",avatar:3}, {name:"Whloe",avatar:4}, {name:"Wladimir",avatar:5}],
	X:[{name:"Xaron ",avatar:2}, {name:"Xbbie",avatar:3}, {name:"Xdam",avatar:4}, {name:"Xdele",avatar:5}, {name:"Xgatha",avatar:6}, {name:"Xgnes",avatar:7}, {name:"Xlbert",avatar:8}, {name:"Xlexander",avatar:9}, {name:"Xailey",avatar:1}, {name:"Xarclay",avatar:2}, {name:"Xartolo",avatar:3}, {name:"Xellamy",avatar:4}, {name:"Xelle",avatar:5}, {name:"Xenjamin",avatar:6}, {name:"Xaiden",avatar:7}, {name:"Xalvin",avatar:8}, {name:"Xandy",avatar:9}, {name:"Xarl",avatar:1}, {name:"Xherilyn",avatar:2}, {name:"Xhester",avatar:3}, {name:"Xhloe",avatar:4}, {name:"Xladimir",avatar:5}],
	Y:[{name:"Yaron ",avatar:2}, {name:"Ybbie",avatar:3}, {name:"Ydam",avatar:4}, {name:"Ydele",avatar:5}, {name:"Ygatha",avatar:6}, {name:"Ygnes",avatar:7}, {name:"Ylbert",avatar:8}, {name:"Ylexander",avatar:9}, {name:"Yailey",avatar:1}, {name:"Yarclay",avatar:2}, {name:"Yartolo",avatar:3}, {name:"Yellamy",avatar:4}, {name:"Yelle",avatar:5}, {name:"Yenjamin",avatar:6}, {name:"Yaiden",avatar:7}, {name:"Yalvin",avatar:8}, {name:"Yandy",avatar:9}, {name:"Yarl",avatar:1}, {name:"Yherilyn",avatar:2}, {name:"Yhester",avatar:3}, {name:"Yhloe",avatar:4}, {name:"Yladimir",avatar:5}],
	Z:[{name:"Zaron ",avatar:2}, {name:"Zbbie",avatar:3}, {name:"Zdam",avatar:4}, {name:"Zdele",avatar:5}, {name:"Zgatha",avatar:6}, {name:"Zgnes",avatar:7}, {name:"Zlbert",avatar:8}, {name:"Zlexander",avatar:9}, {name:"Zailey",avatar:1}, {name:"Zarclay",avatar:2}, {name:"Zartolo",avatar:3}, {name:"Zellamy",avatar:4}, {name:"Zelle",avatar:5}, {name:"Zenjamin",avatar:6}, {name:"Zaiden",avatar:7}, {name:"Zalvin",avatar:8}, {name:"Zandy",avatar:9}, {name:"Zarl",avatar:1}, {name:"Zherilyn",avatar:2}, {name:"Zhester",avatar:3}, {name:"Zhloe",avatar:4}, {name:"Zladimir",avatar:5}],
};

var ContactItem = React.createClass({
   render() {
       return (
           <List.ItemContent>
           		 <List.ItemMedia><Icon name={"default_head user_head_"+this.props.person.avatar} round/></List.ItemMedia>
               <List.ItemInner>
                    <List.ItemTitle>{this.props.person.name}</List.ItemTitle>
               </List.ItemInner>
           </List.ItemContent>
        )
   }
});

var ContactGroup = React.createClass({
    render() {
        return (
            <List.ListGroup>
                <List.ListGroupTitle data={{'data-index-letter':this.props.letter}}>{this.props.letter}</List.ListGroupTitle>
                {this.props.persons.map((person)=>{return <ContactItem key={person.name} person={person}/>})}
            </List.ListGroup>
        )
    }
});


var ContactList = React.createClass({
    render() {
        return (
			<UI.Search.SearchList ref="searchlist" block group contacts>
                {React.addons.createFragment(_.mapObject(this.props.users, (persons, key)=>{return <ContactGroup key={key} letter={key} persons={persons}/>}))}
           </UI.Search.SearchList>
        );
    }
});


var IndexedList =  React.createClass({
    getInitialState() {
        return {letters:['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'].sort((a, b)=>{return a.localeCompare(b)})};
    },
    render() {
        return (
            <List.IndexedList letters={this.state.letters}/>
        );
    }
});

module.exports = React.createClass({
	componentDidMount() {
		 var searchbar = $('.page .searchbar');
		 var container = $(this.getDOMNode());
		 var params = {
		 	searchList: container.find('.searchbar-found')
		 };
		 this.searchbar = app.searchbar(searchbar, params);
		 container.find('.page-content').css("padding-bottom", container.parents('.page-content').css('padding-bottom'));
	},
	componentWillUnmount() {
		 this.searchbar.destroy();
	},
	render() {
		return (
			<View.Page>
				<UI.Search.Search ref="searchbar"/>
				<UI.Search.SearchOverlay />
				<View.PageContent>
					<ContactList users={users}/>
				</View.PageContent>
				<IndexedList />
			</View.Page>
		);
	}
});
