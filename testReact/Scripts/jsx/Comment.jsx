var React = React || null;
var ReactDOM = ReactDOM || null;

var CommentForm = React.createClass({
    getInitialState: function () {
        return {
            author: '',
            text: '',
            message: ''
        };
    },
    handleAuthorChange: function (e) {
        this.setState({
            author: e.target.value,
            message: ''
        });
    },
    handleTextChange: function (e) {
        this.setState({
            text: e.target.value,
            message: ''
        });
    },
    handleSubmit: function (e) {
        e.preventDefault();

        var author = this.state.author.trim();
        var text = this.state.text.trim();

        if (!text || !author) {
            return;
        }

        this.props.onCommentSubmit({ author: author, text: text });
        this.setState(this.getInitialState());
    },
    render: function () {
        var divStyle = {
            padding: '15px',
            "margin-top": '10px'
        };
        return (
            <form onSubmit={this.handleSubmit }>
                <div className="input-group alert-warning" style={divStyle}>
                <input className="form-control"
                       type="text"
                       placeholder="Your Name"
                       value={this.state.author}
                       onChange={this.handleAuthorChange
                } />
                <span className="input-group-btn"></span>
                <input className="form-control"
                       type="text"
                       placeholder="Say Something..."
                       value={this.state.text}
                       onChange={this.handleTextChange
                } />
                <span className="input-group-btn">
                <button className="btn btn-default" type="submit" value="Post">Post</button>
                </span>
                    {this.state.message}
                </div>
            </form>
        );
    }
});

var Comment = React.createClass({
    getInitialState: function () {
        return { toBeDeleted: false }
    },
    deleteComment: function (e) {
        e.preventDefault();
        this.props.onCommentDelete(this.props.id);
        this.setState({ toBeDeleted: true });
    },
    render: function () {
        var commentStyle = {
            "padding-left": '15px',
            "padding-right": '15px',
            "padding-bottom": '15px',
            border: '1px solid transparent',
            "border-radius": '4px',
            display: this.state.toBeDeleted ? 'none' : 'block'
        };
        return (
            <div className="navbar-form alert-success" style={commentStyle}>
                <table width="100%">
                    <tr>
                        <td width="100%" colspan="2">
                        <h3>
                            {this.props.author}
                        </h3>
                        </td>
                    </tr>
                    <tr>
                        <td><span>{this.props.children}</span></td>
                        <td align="right"><button className="btn btn-default" onClick={this.deleteComment }>Delete</button></td>
                    </tr>
                </table>
            </div>
        );
    }
});

var CommentList = React.createClass({
    handleCommentDelete: function (commentId) {
        console.info("Deleting comment with id: " + commentId);

        $.ajax({
            url: this.props.url + '/' + commentId,
            type: 'DELETE',
            success: function () {
                console.info("Deleted: " + commentId);
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    render: function () {
        var onDeleteFunc = this.handleCommentDelete;
        var commentNodes = this.props.comments.map(function (comment) {
            return (
                <Comment author={comment.author} id={comment.id} key={comment.id} onCommentDelete={onDeleteFunc}>
                    {comment.text}
                </Comment>
            );
        });

        return (
            <div>
                <span>Comments: {commentNodes.length}</span>
                {commentNodes}
            </div>
        );
    }
});

var CommentBox = React.createClass({
    getInitialState: function () {
        return {
            data: [],
            errorMessage: ''
        };
    },
    loadCommentsFromServer: function () {
        if (this.isMounted()) {
            $.ajax({
                url: this.props.url,
                dataType: "json",
                cache: false,
                success: function (data) {
                    this.setState({ data: data, errorMessage: '' });
                }.bind(this),
                error: function (xhr, status) {
                    console.error(this.props.url, status, "Error while connecting to the server");
                    this.setState({ errorMessage: "Error while connecting to the server" });
                }.bind(this)
            });
        }
    },
    handleCommentSubmit: function (comment) {
        console.info(comment);
        var comments = this.state.data;

        comment.id = new Date().getMilliseconds();
        var newComments = comments.concat([comment]);
        this.setState({ data: newComments });

        $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'POST',
            data: comment,
            success: function (data) {
                if (data)
                    this.setState({ data: data });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
                this.setState({ errorMessage: err.toString() });
            }.bind(this)
        });
    },
    componentDidMount: function () {
        this.loadCommentsFromServer();
        setInterval(this.loadCommentsFromServer, this.props.pollInterval);
    },
    render: function () {
        var renderError = this.state.errorMessage !== '';
        var divStyle = {
            width: '46%'
        };
        return (
            <div style={divStyle}>
                {renderError ? <ErrorMessage>{this.state.errorMessage}</ErrorMessage> : null}
                <CommentForm onCommentSubmit={this.handleCommentSubmit}></CommentForm>
                <CommentList comments={this.state.data} url={this.props.url}></CommentList>
            </div>
        );
    }
});

var ErrorMessage = React.createClass({
    render: function () {
        var errorStyle = {
            color: 'red',
            fontWeight: 'bold'
        };

        return (
            <span style={errorStyle}>
                {this.props.children}
            </span>
        );
    }
});

var CommentWrapper = React.createClass({
    getInitialState: function () {
        return { isCommentBoxVisible: true }
    },
    handleSwitchClick: function () {
        var nextState = !this.state.isCommentBoxVisible;
        this.setState({ isCommentBoxVisible: nextState });
    },
    render: function () {
        return (
            <div className="navbar-form">
                <button className="btn btn-default" onClick={this.handleSwitchClick }>Switch</button>
                {this.state.isCommentBoxVisible ? <CommentBox url="/api/comment" pollInterval={5000 }></CommentBox> : null}
            </div>
        );
    }
});

ReactDOM.render(
    <CommentWrapper></CommentWrapper>,
    document.getElementById("container")
);