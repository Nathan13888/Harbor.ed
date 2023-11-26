import React from 'react'
import { useNavigate } from 'react-router-dom';
import '../css/App.scss';

const data = {
  headerText: "Hi ✨",
  pText: "",
  p2Text: "Made with React, Dialogflow..(add more here)",
  userMessages: [],
  botMessages: [],
  botGreeting: "oh hi! nice day today?",
  botLoading: false
};

// var


var Header = props => {
  return (
    <div className="header">
      <div className="header-img" />
      <h1> {props.headerText} </h1>
      <h2> {props.pText} </h2>
      <p> {props.p2Text} </p>
    </div>
  );
};

var ChatHeader = props => {
  return (
    <div className="chat-header">
      <div className="dot" />
      <div className="dot" />
      <div className="dot" />
    </div>
  );
};


var UserInput = props => {
  return (
    <div className="input-container">
      <input
        id="chat"
        type="text"
        onKeyDown={props.onInput}
        placeholder="type something"
      />
      <button className="input-submit" onClick={props.onClick} />
    </div>
  );
};

// classes
class UserBubble extends React.Component {
  render() {
    return (
      <div className="user-message-container" ref={this.props.thisRef}>
        <div className="chat-bubble user">
          {this.props.message}
        </div>
      </div>
    );
  }
}

class BotBubble extends React.Component {
  render() {
    return (
      <div className="bot-message-container" ref={this.props.thisRef}>
        <div className="bot-avatar" />
        <div className="chat-bubble bot">
          {this.props.message}
        </div>
      </div>
    );
  }
}

// begin of main:

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = data;
  }


  updateUserMessages = newMessage => {
    if (!newMessage){
      return;  
    }
    
    var updatedMessages = this.state.userMessages;

    var updatedBotMessages = this.state.botMessages;

    this.setState({
      userMessages: updatedMessages.concat(newMessage),
      botLoading: true
    });

    // placeholder dialogflow api call
    var request = new Request(
      "https://api.dialogflow.com/v1/query?v=20150910&contexts=shop&lang=en&query=" +
        newMessage +
        "&sessionId=12345",
      {
        headers: new Headers({
          Authorization: "Bearer bc13467053ad45feaaa6f23c8bfafa9d"
        })
      }
    );

    fetch(request)
      .then(response => response.json())
      .then(json => {
        var botResponse = json.result.fulfillment.speech;

        this.setState({
          botMessages: updatedBotMessages.concat(botResponse),
          botLoading: false
        });
      })
      .catch(error => {
        console.log("ERROR:", error);
         this.setState({
          botMessages: updatedBotMessages.concat(':)'),
          botLoading: false
        });
        // redirect to character selection
        // setTimeout(() => {
        //   this.props.navigate('/character-selection');
        // }, 1000);
      });
  };


  scrollBubble = element => {
    if (element != null) {
      element.scrollIntoView(true);
    }
  };

  showMessages = () => {
    var userMessages = this.state.userMessages;
    var botMessages = this.state.botMessages;

    var allMessages = [];
  
    var i = 0;
    for (; i < userMessages.length; i++) {
      if (i === userMessages.length - 1) {
        //if bot replied to last message
        if (botMessages[i]) {
          allMessages.push(<UserBubble message={userMessages[i]} />);
          allMessages.push(
            <BotBubble message={botMessages[i]} thisRef={this.scrollBubble} />
          );
        } else {
          allMessages.push(
            <UserBubble message={userMessages[i]} thisRef={this.scrollBubble} />
          );
        }
        break;
      }

      allMessages.push(<UserBubble message={userMessages[i]} />);
      allMessages.push(<BotBubble message={botMessages[i]} />);
    }

    allMessages.unshift(
      <BotBubble
        message={this.state.botGreeting}
        thisRef={i === 0 ? this.scrollBubble : ""}
      />
    );

    return <div className="msg-container">{allMessages}</div>;
  };

  onInput = event => {
    if (event.key === "Enter") {
      var userInput = event.target.value;

      this.updateUserMessages(userInput);
      event.target.value = "";
    }
    
    if (event.target.value?.trim()?.length > 0){
      event.target.parentElement.style.background = 'rgba(69,58,148,0.6)';
    }
    else {
      event.target.parentElement.style.background = 'rgba(255, 255, 255, 0.6)';
    }
  };

  onClick = () => {
    var inp = document.getElementById("chat");
    var userInput = inp.value;

    this.updateUserMessages(userInput);
    inp.value = "";
  };



  render() {

    // const readMoreButton = (
    //   <button className="custom-btn btn-6"><span></span></button>
    // );

    
    return (
      <div className="app-container">


        <Header
          headerText={this.state.headerText}
          // buttonElement={readMoreButton}
          pText={this.state.pText}
          p2Text={this.state.p2Text}
        />
        

        
        <div className="chat-container">
          <ChatHeader />
          {this.showMessages()}
          <UserInput onInput={this.onInput} onClick={this.onClick} />
        </div>
      </div>
    );
  }
}

function withNavigate(Component) {
  return props => {
    const navigate = useNavigate();
    return <Component {...props} navigate={navigate} />;
  };
}

// export default Main;
export default withNavigate(Main);