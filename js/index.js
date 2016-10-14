"use strict";

(function () {
	var initialGrid = [],
	    width = 70,
	    height = 50;
	//grid initialization...0 sumbolizes dead cells, 1 newborn cells, and 2 alive cells that are at least 2 generations old
	for (var i = 0; i < height; i++) {
		initialGrid[i] = [];
		for (var j = 0; j < width; j++) {
			initialGrid[i][j] = Math.random() > 0.85 ? 2 : 0;
		}
	}

	var App = React.createClass({
		displayName: "App",

		getInitialState: function getInitialState() {
			return {
				generation: 0,
				grid: initialGrid,
				isGameRunning: true
			};
		},

		componentDidMount: function componentDidMount() {
			this.speed = 150;
			this.interval = setInterval(this.nextGeneration, this.speed);
		},

		findAliveNeighbors: function findAliveNeighbors(x, y) {
			var aliveCount = 0;
			for (var i = x - 1; i < x + 2; i++) {
				for (var j = y - 1; j < y + 2; j++) {
					if (i !== x || j !== y) {
						var indexx = i < 0 ? height - 1 : i > height - 1 ? 0 : i;
						var indexy = j < 0 ? width - 1 : j > width - 1 ? 0 : j;
						if (this.state.grid[indexx][indexy] !== 0) {
							aliveCount++;
						}
					}
				}
			}
			return aliveCount;
		},

		nextGeneration: function nextGeneration() {
			var _this = this;

			var newGrid = this.state.grid.map(function (val, index) {
				return val.map(function (innerVal, innerIndex) {
					var aliveNeighbors = _this.findAliveNeighbors(index, innerIndex);
					if (innerVal === 0) {
						return aliveNeighbors === 3 ? 1 : 0;
					} else {
						return aliveNeighbors < 4 && aliveNeighbors > 1 ? 2 : 0;
					}
				});
			});
			this.setState({
				generation: this.state.generation + 1,
				grid: newGrid
			});
		},

		clear: function clear() {
			var newGrid = this.state.grid.map(function (val) {
				return val.map(function () {
					return 0;
				});
			});
			clearInterval(this.interval);
			this.setState({
				generation: 0,
				grid: newGrid,
				isGameRunning: false
			});
		},

		togglePause: function togglePause() {
			if (this.state.isGameRunning) {
				clearInterval(this.interval);
				this.setState({
					isGameRunning: false
				});
			} else {
				this.interval = setInterval(this.nextGeneration, this.speed);
				this.setState({
					isGameRunning: true
				});
			}
		},

		handleCellClick: function handleCellClick(x, y) {
			this.state.grid[x][y] = this.state.grid[x][y] === 0 ? 2 : 0;
			this.forceUpdate();
		},

		restart: function restart() {
			var newGrid = [];
			for (var i = 0; i < height; i++) {
				newGrid[i] = [];
				for (var j = 0; j < width; j++) {
					newGrid[i][j] = Math.random() > 0.85 ? 2 : 0;
				}
			}
			clearInterval(this.interval);
			this.setState({
				generation: 0,
				grid: newGrid,
				isGameRunning: true
			});
			this.interval = setInterval(this.nextGeneration, this.speed);
		},

		changeSpeed: function changeSpeed(newSpeed) {
			this.speed = newSpeed;
			if (this.state.isGameRunning) {
				clearInterval(this.interval);
				this.interval = setInterval(this.nextGeneration, this.speed);
			}
		},

		render: function render() {
			return React.createElement(
				"div",
				null,
				React.createElement(Header, null),
				React.createElement(UpperInterface, {
					clear: this.clear,
					generation: this.state.generation,
					isGameRunning: this.state.isGameRunning,
					togglePause: this.togglePause,
					restart: this.restart
				}),
				React.createElement(Grid, {
					handleCellClick: this.handleCellClick,
					grid: this.state.grid }),
				React.createElement(LowerInterface, { changeSpeed: this.changeSpeed })
			);
		}
	});

	function Header() {
		return React.createElement(
			"h1",
			null,
			"ReactJS implementation of ",
			React.createElement(
				"a",
				{ href: "https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life" },
				"John Conway's Game of Life"
			)
		);
	}

	function UpperInterface(props) {
		return React.createElement(
			"div",
			{ className: "interface" },
			React.createElement(
				"button",
				{ onClick: props.togglePause },
				props.isGameRunning ? "Pause" : "Run"
			),
			React.createElement(
				"button",
				{ onClick: props.clear },
				"Clear"
			),
			React.createElement(
				"button",
				{ onClick: props.restart },
				"Restart"
			),
			React.createElement(
				"h2",
				null,
				"Generation: ",
				props.generation
			)
		);
	}

	function Grid(props) {
		return React.createElement(
			"div",
			{ className: "grid" },
			props.grid.map(function (val, index) {
				return val.map(function (innerVal, innerIndex) {
					return React.createElement(Cell, {
						x: index,
						y: innerIndex,
						onClick: props.handleCellClick,
						status: innerVal
					});
				});
			})
		);
	}

	function Cell(props) {
		var cellClass = props.status === 2 ? "alive" : props.status === 1 ? "newborn" : "dead";
		return React.createElement("div", {
			className: cellClass,
			onClick: props.onClick.bind(null, props.x, props.y)
		});
	}

	function LowerInterface(props) {
		return React.createElement(
			"div",
			{ className: "interface" },
			React.createElement(
				"h2",
				null,
				"Speed :"
			),
			React.createElement(
				"button",
				{ onClick: props.changeSpeed.bind(null, 300) },
				"Slow"
			),
			React.createElement(
				"button",
				{ onClick: props.changeSpeed.bind(null, 150) },
				"Default"
			),
			React.createElement(
				"button",
				{ onClick: props.changeSpeed.bind(null, 75) },
				"Fast"
			)
		);
	}

	ReactDOM.render(React.createElement(App, null), document.getElementById('app'));
})();