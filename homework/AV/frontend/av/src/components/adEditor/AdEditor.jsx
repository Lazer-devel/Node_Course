import { useEffect, useRef, useState } from 'react'
import DropDown from '../general/DropDown'
import Input from '../general/Input'

import './style.scss'
import { createAgeArr, createVolumeArr } from '../mainPage/utils'
import { useNavigate } from 'react-router'

function AdEditor() {
  const [mark, setMark] = useState('')
  const [model, setModel] = useState('')
  const [generation, setGeneration] = useState('')
  const [year, setYear] = useState('')
  const [volume, setVolume] = useState('')
  const [markList, setMarkList] = useState([])
  const [modelList, setModelList] = useState([])
  const [generationList, setGenerationList] = useState([])
  const commentRef = useRef(null)
  const navigate = useNavigate()
  const [isSendDisabled, setIsSendDisabled] = useState(false)
  const [cost, setCost] = useState('')

  const [fileTitles, setFileTitles] = useState([])
  const uploadRef = useRef(null)

  useEffect(() => {
    setIsSendDisabled(
      !(
        mark &&
        model &&
        generation &&
        year &&
        volume &&
        cost &&
        commentRef.current.value &&
        uploadRef.current.files.length
      )
    )
  }, [cost, generation, mark, model, volume, year])
  useEffect(() => {
    const init = async () => {
      const marks = await fetch('http://localhost:55555/marks', {
        cache: 'no-store',
        credentials: 'include',
      })
      setMarkList(await marks.json())

      if (mark) {
        const models = await fetch(`http://localhost:55555/models?mark=${mark}`)
        setModelList(await models.json())
      }

      if (model) {
        const generations = await fetch(
          `http://localhost:55555/generations?mark=${mark}&model=${model}`
        )
        setGenerationList((await generations.json()).map((el) => el.name))
      }
    }
    init()
  }, [mark, model])

  const markSelected = async (value) => {
    setMark(value)
    setModel(null)
    setGeneration(null)
    setModelList([])
    setGenerationList([])
  }

  const modelSelected = async (value) => {
    setModel(value)
    setGenerationList([])
    setGeneration(null)
  }

  const submit = async () => {
    setIsSendDisabled(true)
    const data = new FormData()
    data.append('mark', mark)
    data.append('model', model)
    data.append('generation', generation)
    data.append('year', year)
    data.append('volume', volume)
    data.append('cost', cost)
    data.append('comment', commentRef.current.value)
    Array.from(uploadRef.current.files).forEach((file) => {
      data.append(file.name, file)
    })

    await fetch('http://localhost:55555/new_ad', {
      method: 'POST',
      credentials: 'include',
      body: data,
    })

    navigate('/')
  }

  return (
    <div className="ad-editor">
      <h1 className="ad-editor__header">
        Новое объявление о продаже автомобиля
      </h1>
      <div className="ad-editor__content">
        <DropDown
          title={mark}
          defaultTitle={'Марка'}
          children={markList}
          onSelect={markSelected}
        />
        <DropDown
          title={model}
          defaultTitle={'Модель'}
          children={modelList}
          onSelect={modelSelected}
        />
        <DropDown
          title={generation}
          defaultTitle={'Поколение'}
          children={generationList}
          onSelect={(value) => setGeneration(value)}
        />
        <DropDown
          title={year}
          defaultTitle={'Год'}
          children={createAgeArr()}
          onSelect={(value) => setYear(value)}
        />
        <DropDown
          title={volume}
          defaultTitle={'Объём'}
          children={createVolumeArr()}
          onSelect={(value) => setVolume(value)}
        />
        <Input title={'Цена'} value={cost} setValue={setCost} />
        <textarea
          className="ad-editor__comment textarea"
          placeholder="Комметарий"
          ref={commentRef}
        ></textarea>
        <div className="ad-editor__files">
          <label className="ad-editor__upload">
            <input
              type="file"
              multiple
              ref={uploadRef}
              onChange={() => {
                console.log(uploadRef.current.files)
                const fileNames = Array.from(uploadRef.current.files).map(
                  (file) => file.name
                )
                setFileTitles(fileNames)
              }}
            />
            Выберите файлы
          </label>
          <div className="ad-editor__files-title">{fileTitles.join(', ')}</div>
        </div>
        <div className="ad-editor__control">
          <button
            className="ad-editor__submit"
            onClick={submit}
            disabled={isSendDisabled}
          >
            Отправить
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdEditor
