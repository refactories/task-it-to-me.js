module.exports = function (outputStream, inputStream) {
  inputStream.resume()

  let projects, currentProject

  const run = (callback) => {
    callback = callback || function () { }

    const processInput = (rawData) => {
      const data = rawData.toString().trim()
      if (data === 'q') {
        callback()
      } else if (!currentProject) {
        if (data === 'ls') {
          outputStream.write('\x1b[38;5;40mListing projects:\x1b[0m\n')
          if (projects) {
            const keys = []
            for (const key in projects) {
              keys.push(key)
            }

            if (keys.length) {
              keys.forEach(function (projectName) {
                outputStream.write('  ' + projectName + '\n')
              })
              outputStream.write('\n')
              inputStream.once('data', processInput)
            } else {
              outputStream.write('\x1b[40;38;5;214mNo projects created\x1b[0m\n\n')
              inputStream.once('data', processInput)
            }
          } else {
            outputStream.write('\x1b[40;38;5;214mNo projects created\x1b[0m\n\n')
            inputStream.once('data', processInput)
          }
        } else if (data === 'a') {
          outputStream.write('\x1b[0;3mEnter a project name:\x1b[0m')
          inputStream.once('data', function (rawData) {
            const projectName = rawData.toString().trim()
            if (!projects) {
              projects = {}
            }
            projects[projectName] = []
            outputStream.write("\x1b[38;5;40mCreated project:\x1b[0m '" + projectName + "'\n\n")
            inputStream.once('data', processInput)
          })
        } else if (data === 'd') {
          if (!projects) {
            outputStream.write('\x1b[40;38;5;214mNo projects created\x1b[0m\n\n')
            outputStream.write("\x1b[40;38;5;214mCan't delete a project\x1b[0m\n\n")
            inputStream.once('data', processInput)
          } else {
            const keys = []
            for (const key in projects) {
              keys.push(key)
            }

            if (keys.length) {
              outputStream.write('\x1b[0;3mEnter a project name: \x1b[0m')
              inputStream.once('data', function (rawData) {
                const projectName = rawData.toString().trim()
                if (projects[projectName]) {
                  delete projects[projectName]
                  outputStream.write("\x1b[38;5;40mDeleting project:\x1b[0m '" + projectName + "'\n\n")
                  inputStream.once('data', processInput)
                } else {
                  outputStream.write("\x1b[40;38;5;214mProject doesn't exist: '" + projectName + "'\x1b[0m\n\n")
                  inputStream.once('data', processInput)
                }
              })
            }
          }
        } else if (data === 'e') {
          if (projects) {
            const keys = []
            for (const key in projects) {
              keys.push(key)
            }
            if (keys.length) {
              outputStream.write('\x1b[0;3mEnter a project name: \x1b[0m')
              inputStream.once('data', function (rawData) {
                const projectName = rawData.toString().trim()
                if (projects[projectName]) {
                  outputStream.write("\x1b[38;5;40mEditing project:\x1b[0m '" + projectName + "'\n\n")
                  currentProject = projectName
                  outputStream.write(
                    '\x1b[0mTASKS MENU\n' +
                    '\x1b[0;37m-----------------------------\n' +
                    '\x1b[40;38;5;214mENTER A COMMAND:\x1b[0m\n' +
                    '\x1b[1;37mc   \x1b[0;35mChange the project name\n' +
                    '\x1b[1;37ma   \x1b[0;35mAdd a new task\n' +
                    '\x1b[1;37mls  \x1b[0;35mList all tasks\n' +
                    '\x1b[1;37md   \x1b[0;35mDelete a task\n' +
                    '\x1b[1;37me   \x1b[0;35mEdit a task\n' +
                    '\x1b[1;37mf   \x1b[0;35mFinish a task\n' +
                    '\x1b[1;37mb   \x1b[0;35mBack to Projects menu\x1b[0m\n\n\n'
                  )
                  inputStream.once('data', processInput)
                } else {
                  outputStream.write("\x1b[40;38;5;214mProject doesn't exist: '" + projectName + "'\x1b[0m\n\n")
                  inputStream.once('data', processInput)
                }
              })
            }
          }
          inputStream.once('data', processInput)
        }
      } else {
        if (data === 'c') {
          outputStream.write('\x1b[0;35mEnter new project name:\x1b[0m')
          inputStream.once('data', function (rawData) {
            const newName = rawData.toString().trim()
            const tasks = projects[currentProject]
            delete projects[currentProject]
            projects[newName] = tasks
            outputStream.write("\x1b[0;35mChanged project name from\x1b[0m '" + currentProject + "' \x1b[38;5;40mto\x1b[0m '" + newName + "'\n\n\x1b[0m")
            currentProject = newName
            inputStream.once('data', processInput)
          })
        } else if (data === 'a') {
          outputStream.write('\x1b[0;35mEnter a task name:\x1b[0m')
          inputStream.once('data', function (rawData) {
            const taskName = rawData.toString().trim()
            projects[currentProject].push(taskName)
            outputStream.write("\x1b[0;35mCreated task: '" + taskName + "'\n\x1b[0m")
            inputStream.once('data', processInput)
          })
        } else if (data === 'ls') {
          if (!projects[currentProject].length) {
            outputStream.write("\x1b[40;38;5;214mNo tasks created in '" + currentProject + "'\x1b[0m\n\n")
          } else {
            outputStream.write('\x1b[38;5;40mListing tasks in ' + currentProject + ':\x1b[0m\n')
            projects[currentProject].forEach(function (taskName) {
              outputStream.write('  ' + taskName + '\n')
            })
            outputStream.write('\n')
          }
          inputStream.once('data', processInput)
        } else if (data === 'e') {
          inputStream.once('data', function (rawData) {
            const oldName = rawData.toString().trim()
            const index = projects[currentProject].indexOf(oldName)
            if (index >= 0) {
              inputStream.once('data', function (rawData) {
                const newName = rawData.toString().trim()
                projects[currentProject][index] = newName
                outputStream.write("\x1b[0;35mChanged task name from\x1b[0m '" + oldName + "' \x1b[38;5;40mto\x1b[0m '" + newName + "'\n\n\x1b[0m")
                inputStream.once('data', processInput)
              })
            } else {
              outputStream.write("\x1b[40;38;5;214mTask doesn't exist: '" + oldName + "'\x1b[0m\n\n")
              inputStream.once('data', processInput)
            }
          })
        } else if (data === 'd') {
          inputStream.once('data', function (rawData) {
            const taskName = rawData.toString().trim()
            const i = projects[currentProject].indexOf(taskName)
            if (!projects[currentProject].length) {
              outputStream.write("\x1b[40;38;5;214mNo tasks created in '" + currentProject + "'\x1b[0m\n\n")
              inputStream.once('data', processInput)
            } else if (i === -1) {
              outputStream.write("\x1b[40;38;5;214mTask doesn't exist: '" + taskName + "'\x1b[0m\n\n")
              inputStream.once('data', processInput)
            } else {
              projects[currentProject].splice(i, 1)
              outputStream.write("\x1b[38;5;40mDeleted task:\x1b[0m '" + taskName + "'\n\n")
              inputStream.once('data', processInput)
            }
          })
        } else if (data === 'f') {
          inputStream.once('data', function (rawData) {
            const task = rawData.toString().trim()
            const idx = projects[currentProject].indexOf(task)
            if (idx < 0) {
              outputStream.write("\x1b[40;38;5;214mTask not found: '" + task + "'\x1b[0m\n\n")
              inputStream.once('data', processInput)
            } else {
              projects[currentProject].splice(idx, 1)
              outputStream.write("\x1b[38;5;40mFinished task:\x1b[0m '" + task + "'!\n\n")
              inputStream.once('data', processInput)
            }
          })
        } else if (data === 'b') {
          currentProject = undefined
          inputStream.once('data', processInput)
        } else {
          // console.log('unhandled', data)
        }
      }
    }

    outputStream.write(
      '\x1b[38;5;40mWelcome to Taskitome!\n' +
      '\x1b[0;37m=============================\n\n' +
      '\x1b[0mPROJECTS MENU\n' +
      '\x1b[0;37m-----------------------------\n' +
      '\x1b[40;38;5;214mENTER A COMMAND:\x1b[0m\n' +
      '\x1b[1;37ma   \x1b[0;35mAdd a new project\n' +
      '\x1b[1;37mls  \x1b[0;35mList all project\n' +
      '\x1b[1;37md   \x1b[0;35mDelete a project\n' +
      '\x1b[1;37me   \x1b[0;35mEdit a project\n' +
      '\x1b[1;37mq   \x1b[0;35mQuit the app\x1b[0m\n\n\n'
    )

    inputStream.once('data', processInput)
  }

  return {
    run: run
  }
}
