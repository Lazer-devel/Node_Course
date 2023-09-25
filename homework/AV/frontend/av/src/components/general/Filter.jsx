import { useEffect, useState } from 'react'

import { createAgeArr, createVolumeArr, fetchData } from '../mainPage/utils'
import './styles/filter.scss'
import DropDown from './DropDown'
import Input from './Input'

function Filter({ selectedMark = null }) {
  const [mark, setMark] = useState(selectedMark)
  const [model, setModel] = useState(null)
  const [generation, setGeneration] = useState(null)
  const [beginYear, setBeginYear] = useState(null)
  const [endYear, setEndYear] = useState(null)
  const [beginCost, setBeginCost] = useState('')
  const [endCost, setEndCost] = useState('')
  const [beginVolume, setBeginVolume] = useState(null)
  const [endVolume, setEndVolume] = useState(null)
  const [amount, setAmount] = useState(null)
  const [markList, setMarkList] = useState([])
  const [modelList, setModelList] = useState([])
  const [generationList, setGenerationList] = useState([])

  useEffect(() => {
    const getMarks = async () => {
      const marks = await fetchData('/marks', {
        cache: 'no-store',
        credentials: 'include',
      })
      setMarkList(marks)
    }
    getMarks()
  }, [])

  useEffect(() => {
    if (!markList) {
      return
    }

    const controller = new AbortController()
    const getAnnoumentCount = async () => {
      const urlParams = new URLSearchParams()
      mark && urlParams.append('mark', mark)
      model && urlParams.append('model', model)
      generation && urlParams.append('generation', generation)
      beginYear && urlParams.append('beginYear', beginYear)
      endYear && urlParams.append('endYear', endYear)
      beginCost && urlParams.append('beginCost', beginCost)
      endCost && urlParams.append('endCost', endCost)
      beginVolume && urlParams.append('beginVolume', beginVolume)
      endVolume && urlParams.append('endVolume', endVolume)

      const amount = await fetchData(`/annoumentsCount?${urlParams}`, {
        cache: 'no-store',
        credentials: 'include',
        signal: controller.signal,
      })
      setAmount(amount)
    }

    getAnnoumentCount()

    return () => {
      //controller.abort()
    }
  }, [
    mark,
    model,
    generation,
    beginYear,
    endYear,
    beginCost,
    endCost,
    beginVolume,
    endVolume,
    markList,
  ])

  const markSelected = async (value) => {
    setMark(value)
    setModel(null)
    setGeneration(null)
    setModelList([])
    setGenerationList([])
    const models = await fetchData(`/models?mark=${value}`)
    setModelList(models)
  }

  const modelSelected = async (value) => {
    setModel(value)
    setGenerationList([])
    setGeneration(null)
    const generations = await fetchData(
      `/generations?mark=${mark}&model=${value}`
    )
    setGenerationList(generations)
  }

  const createGenerationChildren = () => {
    return generationList.map(({ name, beginYear, endYear, id }) => {
      return (
        <>
          <img
            src={`http://localhost:55555/generations/${id}.jpeg`}
            alt={name}
            width="200px"
            height="120px"
            style={{ objectFit: 'cover' }}
          ></img>
          <span>{`${name}, ${beginYear}...${endYear ?? ''}`}</span>
        </>
      )
    })
  }

  return (
    <div className="filter">
      <h2 className="filter__title title"> Поиск по параметрам</h2>
      <div className="filter__main-info">
        <div className="filter__field">
          <div className="filter__field-controls">
            <div className="filter__field-control">
              <DropDown
                title={mark}
                defaultTitle="Марка"
                children={markList}
                onSelect={markSelected}
              />
            </div>
          </div>
        </div>
        <div className="filter__field">
          <div className="filter__field-controls">
            <div className="filter__field-control">
              <DropDown
                title={model}
                defaultTitle="Модель"
                children={modelList}
                onSelect={modelSelected}
              />
            </div>
          </div>
        </div>
        <div className="filter__field">
          <div className="filter__field-controls">
            <div className="filter__field-control">
              <DropDown
                title={generation}
                defaultTitle="Поколение"
                children={createGenerationChildren()}
                onSelect={(value) => {
                  console.log(value)
                  //value: 'generation, beginYear...endYear'
                  //FIXME
                  setGeneration(value.split(',')[0])
                }}
                contentFormat="table"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="filter__secondary">
        <div className="filter__field">
          <div className="filter__field-controls">
            <div className="filter__field-control">
              <DropDown
                title={beginYear}
                defaultTitle="Год от"
                children={createAgeArr()}
                onSelect={(value) => {
                  setBeginYear(value)
                }}
              />
            </div>
            <div className="filter__field-control">
              <DropDown
                title={endYear}
                defaultTitle="до"
                children={createAgeArr()}
                onSelect={(value) => {
                  setEndYear(value)
                }}
              />
            </div>
          </div>
        </div>
        <div className="filter__field">
          <div className="filter__field-controls">
            <div className="filter__field-control">
              <Input
                title={'Цена от'}
                value={beginCost}
                setValue={(value) => setBeginCost(value)}
              />
            </div>
            <div className="filter__field-control">
              <Input
                title={'до'}
                value={endCost}
                setValue={(value) => setEndCost(value)}
              />
            </div>
            <div className="filter__field-control">
              <DropDown
                title={'USD'}
                defaultTitle="Валюта"
                children={[]}
                onSelect={() => {}}
              />
            </div>
          </div>
        </div>
        <div className="filter__field">
          <div className="filter__field-controls">
            <div className="filter__field-control">
              <DropDown
                title={beginVolume && `${beginVolume} л.`}
                defaultTitle="Объём от"
                children={createVolumeArr()}
                onSelect={(value) => {
                  setBeginVolume(value)
                }}
              />
            </div>
            <div className="filter__field-control">
              <DropDown
                title={endVolume}
                defaultTitle="До"
                children={createVolumeArr()}
                onSelect={(value) => {
                  setEndVolume(value)
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="filter__control">
        <button
          className={`filter__show ${amount ? '' : 'filter__show--disabled'}`}
          disabled={!amount}
        >
          {amount ? `Показать ${amount} объявления` : 'Ничего не найдено'}
        </button>
      </div>
    </div>
  )
}

export default Filter
