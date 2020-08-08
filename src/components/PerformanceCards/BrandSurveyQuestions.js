import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  TextField,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';

const HelpMessageContainer = styled.div`
  margin-bottom: 20px;
`;

const RootContainer = styled.form`
  background: #f5f5f5;
  color: #333;
  padding: 14px;
`;

const styles = () => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
  },
  addQuestionContainer: {
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  addQuestionButton: {
    margin: '24px',
    justifyContent: 'center',
  },
});

const helpMessage = `This module requires you to provide multiple choice questions and answers for your brand survey.`;
const maxQuestionLength = 200;
const maxAnswerLength = 600;

class BrandSurveyQuestions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newQuestion: ``,
      newAnswers: ``,
      questionError: false,
      answerError: false,
    };
  }

  handleCreate = () => {
    const { questions, moduleUpdated } = this.props;
    const { questionError, answerError, newQuestion, newAnswers } = this.state;
    const newAnswersList = newAnswers.split(',');
    if (
      !questionError &&
      !answerError &&
      newQuestion.length > 1 &&
      newAnswersList.length > 0
    ) {
      questions.push({
        question: newQuestion,
        answers: newAnswersList,
      });
    }
    moduleUpdated({ questions });
    this.setState({
      newQuestion: ``,
      newAnswers: ``,
      questionError: false,
      answerError: false,
    });
  };

  handleDelete = (question, answers) => {
    const { questions, moduleUpdated } = this.props;
    const newQuestions = questions.filter(
      q => q.question !== question && q.answers !== answers,
    );
    moduleUpdated({ questions: newQuestions });
  };

  handleQuestionChanged = event => {
    const question = event.target.value;
    if (question.length > 200) {
      this.setState({
        questionError: true,
        newQuestion: question.slice(0, maxQuestionLength),
      });
    } else {
      this.setState({ questionError: false, newQuestion: question });
    }
  };

  handleAnswerChanged = event => {
    const answers = event.target.value;
    const answerArray = answers.split(',').filter(str => str.length > 0);
    if (
      (answers.length > 0 && answerArray.length <= 1) ||
      answers.length >= maxAnswerLength
    ) {
      this.setState({
        answerError: true,
        newAnswers: answers,
      });
    } else {
      this.setState({
        answerError: false,
        newAnswers: answers,
      });
    }
  };

  render() {
    const { questions, classes } = this.props;
    const { questionError, answerError, newQuestion, newAnswers } = this.state;
    return (
      <div>
        <HelpMessageContainer>{helpMessage}</HelpMessageContainer>
        <List>
          {questions.map(({ question, answers }, idx) => (
            // eslint-disable-next-line react/no-array-index-key
            <ListItem key={idx} className={classes.container}>
              <ListItemText primary={`Q:   ${question}`} />
              <ListItemText primary={`A:   ${answers.join(`,`)}`} />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => this.handleDelete(question, answers)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
        <RootContainer
          autoComplete="off"
          className={classes.addQuestionContainer}
        >
          <TextField
            id="standard-basic"
            multiline
            fullWidth
            error={questionError}
            helperText={
              questionError
                ? `200 character limit. (${newQuestion.length}/200)`
                : ``
            }
            placeholder="Ex. What company uses billboard advertisements?"
            label="Your Question"
            value={newQuestion}
            onChange={this.handleQuestionChanged}
            inputProps={{
              maxLength: maxQuestionLength + 1,
            }}
          />
          <TextField
            id="Outlined"
            multiline
            fullWidth
            error={answerError}
            helperText={
              answerError
                ? 'Answers must be separated by commas and total length must not exceed 600 characters!'
                : ``
            }
            placeholder="Ex. Coca Cola, Google, Apple, Alaska Airlines"
            label="Your Answers (separated by commas)"
            value={newAnswers}
            onChange={this.handleAnswerChanged}
            inputProps={{
              maxLength: maxAnswerLength + 1,
            }}
          />
          <Button
            size="small"
            className={classes.addQuestionButton}
            variant="contained"
            color="secondary"
            onClick={() => this.handleCreate()}
          >
            Add Question To Survey
          </Button>
        </RootContainer>
      </div>
    );
  }
}

BrandSurveyQuestions.propTypes = {
  questions: PropTypes.arrayOf(PropTypes.object),
  moduleUpdated: PropTypes.func.isRequired,
  classes: PropTypes.shape({
    container: PropTypes.string,
    addQuestionContainer: PropTypes.string,
    addQuestionButton: PropTypes.string,
  }).isRequired,
};

BrandSurveyQuestions.defaultProps = {
  questions: [],
};

export default withStyles(styles)(BrandSurveyQuestions);
