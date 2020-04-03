const App = require('../lib/app')
const expect = require('chai').expect

const TestStreams = require('./support/TestStreams')

describe('App', () => {
  it('quits when it gets the "q" command', (done) => {
    const testStreams = new TestStreams()
    const app = new App(testStreams.outputStream, testStreams.inputStream)

    app.run(() => {
      expect(testStreams.plainOutput()).to.include('Welcome to Taskitome!')
      expect(testStreams.plainOutput()).to.include('a   Add a new project')
      expect(testStreams.plainOutput()).to.include('ls  List all project')
      expect(testStreams.plainOutput()).to.include('d   Delete a project')
      expect(testStreams.plainOutput()).to.include('e   Edit a project')
      expect(testStreams.plainOutput()).to.include('q   Quit the app')
      done()
    })

    testStreams.mockInput(['q'])
  })

  it('failure message when listing project and there are no projects', (done) => {
    const testStreams = new TestStreams()
    const app = new App(testStreams.outputStream, testStreams.inputStream)

    app.run(() => {
      expect(testStreams.plainOutput()).to.include('No projects created')
      done()
    })

    testStreams.mockInput(['ls', 'q'])
  })

  it('adding projects works', (done) => {
    const testStreams = new TestStreams()
    const app = new App(testStreams.outputStream, testStreams.inputStream)

    app.run(() => {
      expect(testStreams.plainOutput()).to.include('Enter a project name')
      expect(testStreams.plainOutput()).to.include(
        "Created project: 'Cat Husbandry'"
      )
      done()
    })

    testStreams.mockInput(['a', 'Cat Husbandry', 'q'])
  })

  it('listing projects', (done) => {
    const testStreams = new TestStreams()
    const app = new App(testStreams.outputStream, testStreams.inputStream)

    app.run(() => {
      expect(testStreams.plainOutput()).to.include(
        'Listing projects:\n  Cat Servitude\n  House work'
      )
      done()
    })

    testStreams.mockInput(['a', 'Cat Servitude', 'a', 'House work', 'ls', 'q'])
  })

  it('deleting projects when no projects', (done) => {
    const testStreams = new TestStreams()
    const app = new App(testStreams.outputStream, testStreams.inputStream)

    app.run(() => {
      expect(testStreams.plainOutput()).to.include('No projects created')
      expect(testStreams.plainOutput()).to.include("Can't delete a project")
      done()
    })

    testStreams.mockInput(['d', 'q'])
  })

  it('deleting projects when there is a project', (done) => {
    const testStreams = new TestStreams()
    const app = new App(testStreams.outputStream, testStreams.inputStream)

    app.run(() => {
      expect(testStreams.plainOutput()).to.include(
        "Deleting project: 'House work'"
      )
      done()
    })

    testStreams.mockInput(['a', 'House work', 'd', 'House work', 'ls', 'q'])
  })

  it('deleting a project that does not exist', (done) => {
    const testStreams = new TestStreams()
    const app = new App(testStreams.outputStream, testStreams.inputStream)

    app.run(() => {
      expect(testStreams.plainOutput()).to.include(
        "Project doesn't exist: 'House Work'"
      )
      done()
    })

    testStreams.mockInput(['a', 'House work', 'd', 'House Work', 'q'])
  })

  it('editing a project that does not exist', (done) => {
    const testStreams = new TestStreams()
    const app = new App(testStreams.outputStream, testStreams.inputStream)

    app.run(() => {
      expect(testStreams.plainOutput()).to.include(
        "Project doesn't exist: 'House Work'"
      )
      done()
    })

    testStreams.mockInput(['a', 'House work', 'e', 'House Work', 'q'])
  })

  it('editing a project shows tasks menu', (done) => {
    const testStreams = new TestStreams()
    const app = new App(testStreams.outputStream, testStreams.inputStream)

    app.run(() => {
      expect(testStreams.plainOutput()).to.include(
        'c   Change the project name'
      )
      expect(testStreams.plainOutput()).to.include('a   Add a new task')
      expect(testStreams.plainOutput()).to.include('ls  List all tasks')
      expect(testStreams.plainOutput()).to.include('d   Delete a task')
      expect(testStreams.plainOutput()).to.include('e   Edit a task')
      expect(testStreams.plainOutput()).to.include('f   Finish a task')
      expect(testStreams.plainOutput()).to.include('b   Back to Projects menu')
      done()
    })

    testStreams.mockInput(['a', 'House work', 'e', 'House work', 'q'])
  })

  it('changing a project name', (done) => {
    const testStreams = new TestStreams()
    const app = new App(testStreams.outputStream, testStreams.inputStream)

    app.run(() => {
      expect(testStreams.plainOutput()).to.include(
        "Changed project name from 'House work' to 'Chores'"
      )
      done()
    })

    testStreams.mockInput([
      'a', 'House work', 'e', 'House work', 'c', 'Chores', 'q'
    ])
  })

  it('adding a task', (done) => {
    const testStreams = new TestStreams()
    const app = new App(testStreams.outputStream, testStreams.inputStream)

    app.run(() => {
      expect(testStreams.plainOutput()).to.include('Enter a task name')
      expect(testStreams.plainOutput()).to.include(
        "Created task: 'clean out the freezer'"
      )
      done()
    })

    testStreams.mockInput([
      'a', 'House work', 'e', 'House work', 'a', 'clean out the freezer', 'q'
    ])
  })

  it('listing tasks when no tasks exists', (done) => {
    const testStreams = new TestStreams()
    const app = new App(testStreams.outputStream, testStreams.inputStream)

    app.run(() => {
      expect(testStreams.plainOutput()).to.include(
        "No tasks created in 'House work'"
      )
      done()
    })

    testStreams.mockInput(['a', 'House work', 'e', 'House work', 'ls', 'q'])
  })

  it('listing tasks when tasks exist', (done) => {
    const testStreams = new TestStreams()
    const app = new App(testStreams.outputStream, testStreams.inputStream)

    app.run(() => {
      const lastPart = testStreams.plainOutput()
        .split("Created task: 'clean out the freezer'")[1]
      expect(lastPart).to.include('clean out the freezer')
      done()
    })

    testStreams.mockInput([
      'a', 'House work', 'e', 'House work', 'a', 'clean out the freezer', 'ls',
      'q'
    ])
  })

  it('editing a task that does not exist', (done) => {
    const testStreams = new TestStreams()
    const app = new App(testStreams.outputStream, testStreams.inputStream)

    app.run(() => {
      expect(testStreams.plainOutput()).to.include(
        "Task doesn't exist: 'clean out the freezer'"
      )
      done()
    })

    testStreams.mockInput([
      'a', 'House work', 'e', 'House work', 'e', 'clean out the freezer', 'q'
    ])
  })

  it('editing a task that does exist', (done) => {
    const testStreams = new TestStreams()
    const app = new App(testStreams.outputStream, testStreams.inputStream)

    app.run(() => {
      const lastOutput = testStreams.plainOutput().split('Listing tasks')[1]
      expect(lastOutput).to.not.include('clean out the freezer')
      expect(lastOutput).to.include('clean out fridge')
      done()
    })

    testStreams.mockInput([
      'a', 'House work', 'e', 'House work', 'a', 'clean out the freezer',
      'e', 'clean out the freezer', 'clean out fridge', 'ls', 'q'
    ])
  })

  it('deleting a task when tasks are empty', (done) => {
    const testStreams = new TestStreams()
    const app = new App(testStreams.outputStream, testStreams.inputStream)

    app.run(() => {
      expect(testStreams.plainOutput()).to.include(
        "No tasks created in 'House work'"
      )
      done()
    })

    testStreams.mockInput([
      'a', 'House work', 'e', 'House work', 'd', 'clean out the freezer', 'q'
    ])
  })

  it('deleting a task that does not exist exists', (done) => {
    const testStreams = new TestStreams()
    const app = new App(testStreams.outputStream, testStreams.inputStream)

    app.run(() => {
      expect(testStreams.plainOutput()).to.include(
        "Task doesn't exist: 'eat defrosting food'"
      )
      done()
    })

    testStreams.mockInput([
      'a', 'House work', 'e', 'House work', 'a', 'clean out the freezer',
      'd', 'eat defrosting food', 'q'
    ])
  })

  it('deleting a task that exists', (done) => {
    const testStreams = new TestStreams()
    const app = new App(testStreams.outputStream, testStreams.inputStream)

    app.run(() => {
      expect(testStreams.plainOutput()).to.include(
        "Deleted task: 'clean out the freezer'"
      )
      done()
    })

    testStreams.mockInput([
      'a', 'House work', 'e', 'House work', 'a', 'clean out the freezer',
      'd', 'clean out the freezer', 'ls', 'q'
    ])
  })

  it('finishing a task when tasks are empty', (done) => {
    const testStreams = new TestStreams()
    const app = new App(testStreams.outputStream, testStreams.inputStream)

    app.run(() => {
      expect(testStreams.plainOutput()).to.include(
        "Task not found: 'clean out the freezer'"
      )
      done()
    })

    testStreams.mockInput([
      'a', 'House work', 'e', 'House work', 'f', 'clean out the freezer', 'q'
    ])
  })

  it('finishing a task that does not exist exists', (done) => {
    const testStreams = new TestStreams()
    const app = new App(testStreams.outputStream, testStreams.inputStream)

    app.run(() => {
      expect(testStreams.plainOutput()).to.include(
        "Task not found: 'eat defrosting food'"
      )
      done()
    })

    testStreams.mockInput([
      'a', 'House work', 'e', 'House work', 'a', 'clean out the freezer',
      'f', 'eat defrosting food', 'q'
    ])
  })

  it('finishing a task that exists', (done) => {
    const testStreams = new TestStreams()
    const app = new App(testStreams.outputStream, testStreams.inputStream)

    app.run(() => {
      expect(testStreams.plainOutput()).to.include(
        "Finished task: 'clean out the freezer'!"
      )
      done()
    })

    testStreams.mockInput([
      'a', 'House work', 'e', 'House work', 'a', 'clean out the freezer',
      'f', 'clean out the freezer', 'ls', 'q'
    ])
  })

  it('going back to the projects menu', (done) => {
    const testStreams = new TestStreams()
    const app = new App(testStreams.outputStream, testStreams.inputStream)

    app.run(() => {
      const numberOfTimesProjectsListed = testStreams
        .plainOutput()
        .split('Listing projects')
        .length - 1
      expect(numberOfTimesProjectsListed).to.equal(1)
      done()
    })

    testStreams.mockInput([
      'a', 'House work', 'e', 'House work', 'b', 'ls', 'q'
    ])
  })
})
