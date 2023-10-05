import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import DropDown from '../components/reusable/DropDown'
import { createAgeArr, createVolumeArr } from '../components/reusable/utils'
import Input from '../components/reusable/Input'

import '../styles/new_ad.scss'

const newAd = () => {
  const [mark, setMark] = useState('')
  const [model, setModel] = useState('')
  const [generation, setGeneration] = useState('')
  const [year, setYear] = useState('')
  const [volume, setVolume] = useState('')
  const [markList, setMarkList] = useState([])
  const [modelList, setModelList] = useState([])
  const [generationList, setGenerationList] = useState([])
  const [comment, setComment] = useState('')
  const [cost, setCost] = useState('')
  const [uploadFilse, setUploadFiles] = useState([])
  const router = useRouter()
  const [isSendDisabled, setIsSendDisabled] = useState(false)
  const [fileTitles, setFileTitles] = useState([])

  useEffect(() => {
    setIsSendDisabled(
      !(
        mark &&
        model &&
        generation &&
        year &&
        volume &&
        cost &&
        comment &&
        uploadFilse.length
      )
    )
  }, [comment, cost, generation, mark, model, uploadFilse.length, volume, year])
  useEffect(() => {
    const init = async () => {
      const marks = await fetch(`/api/marks`, {
        cache: 'no-store',
        credentials: 'include',
      })
      setMarkList(await marks.json())

      if (mark) {
        const models = await fetch(`/api/models?mark=${mark}`)
        setModelList(await models.json())
      }

      if (model) {
        const generations = await fetch(
          `/api/generations?mark=${mark}&model=${model}`
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
    data.append('comment', comment)
    Array.from(uploadFilse).forEach((file) => {
      data.append(file.name, file)
    })

    await fetch(`/api/createAd`, {
      method: 'POST',
      credentials: 'include',
      body: data,
    })

    router.push('/')
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
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></textarea>
        <div className="ad-editor__files">
          <label className="ad-editor__upload">
            <input
              type="file"
              multiple
              onChange={(e) => {
                console.log(e.target.files)
                setUploadFiles(e.target.files)
                const fileNames = Array.from(e.target.files).map(
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

export default newAd
