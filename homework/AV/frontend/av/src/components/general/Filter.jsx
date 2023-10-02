import { useCallback, useEffect, useState } from 'react'
import {
  NavLink,
  useLocation,
  useParams,
  useSearchParams,
} from 'react-router-dom'

import { createAgeArr, createVolumeArr, fetchData } from '../mainPage/utils'
import './styles/filter.scss'
import DropDown from './DropDown'
import Input from './Input'

function Filter() {
  const [searchParams] = useSearchParams()
  const [mark, setMark] = useState(searchParams.get('mark'))
  const [model, setModel] = useState(searchParams.get('model'))
  const [generation, setGeneration] = useState(searchParams.get('generation'))
  const [beginYear, setBeginYear] = useState(searchParams.get('beginYear'))
  const [endYear, setEndYear] = useState(searchParams.get('endYear'))
  const [beginCost, setBeginCost] = useState(searchParams.get('endYear') ?? '')
  const [endCost, setEndCost] = useState(searchParams.get('endYear') ?? '')
  const [beginVolume, setBeginVolume] = useState(
    searchParams.get('beginVolume')
  )
  const [endVolume, setEndVolume] = useState(searchParams.get('endVolume'))
  const [amount, setAmount] = useState(null)
  const [markList, setMarkList] = useState([])
  const [modelList, setModelList] = useState([])
  const [generationList, setGenerationList] = useState([])

  {
    const location = useLocation()
    const { mark, model } = useParams()
    useEffect(() => {
      if (location.pathname === '/filter') {
        return
      }
      setMark(mark)
      setModel(model)
    }, [mark, model, location])
  }

  useEffect(() => {
    const getInitData = async () => {
      const marks = await fetchData('/marks', {
        cache: 'no-store',
        credentials: 'include',
      })
      setMarkList(marks)

      if (mark) {
        const models = await fetchData(`/models?mark=${mark}`)
        setModelList(models)
      }

      if (model) {
        const generations = await fetchData(
          `/generations?mark=${mark}&model=${model}`
        )
        setGenerationList(generations)
      }
    }
    getInitData()
  }, [mark, model])

  const createUrlParams = useCallback(() => {
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

    return `${urlParams.size ? `?${urlParams.toString()}` : ''}`
  }, [
    beginCost,
    beginVolume,
    beginYear,
    endCost,
    endVolume,
    endYear,
    generation,
    mark,
    model,
  ])
  useEffect(() => {
    if (!markList) {
      return
    }
    const controller = new AbortController()
    const getAnnoumentCount = async () => {
      const amount = await fetchData(`/annoumentsCount${createUrlParams()}`, {
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
  }, [createUrlParams, markList])

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

  const createGenerationChildren = () => {
    return generationList.map(({ name, beginYear, endYear, id }) => {
      return (
        <>
          <img
            key={id}
            src={`/generations/${id}.jpeg`}
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

  const mainSubFilterChildren = [
    [
      <DropDown
        title={mark}
        defaultTitle="Марка"
        children={markList}
        onSelect={markSelected}
      />,
    ],
    [
      <DropDown
        title={model}
        defaultTitle="Модель"
        children={modelList}
        onSelect={modelSelected}
      />,
    ],
    [
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
      />,
    ],
  ]

  const secondarySubFilterChildren = [
    [
      <DropDown
        title={beginYear}
        defaultTitle="Год от"
        children={createAgeArr()}
        onSelect={(value) => {
          setBeginYear(value)
        }}
      />,
      <DropDown
        title={endYear}
        defaultTitle="до"
        children={createAgeArr()}
        onSelect={(value) => {
          setEndYear(value)
        }}
      />,
    ],
    [
      <Input
        title={'Цена от'}
        value={beginCost}
        setValue={(value) => setBeginCost(value)}
      />,
      <Input
        title={'до'}
        value={endCost}
        setValue={(value) => setEndCost(value)}
      />,
      <DropDown
        title={'USD'}
        defaultTitle="Валюта"
        children={[]}
        onSelect={() => {}}
      />,
    ],
    [
      <DropDown
        title={beginVolume && `${beginVolume} л.`}
        defaultTitle="Объём от"
        children={createVolumeArr()}
        onSelect={(value) => {
          setBeginVolume(value)
        }}
      />,
      <DropDown
        title={endVolume}
        defaultTitle="До"
        children={createVolumeArr()}
        onSelect={(value) => {
          setEndVolume(value)
        }}
      />,
    ],
  ]

  const createFilterControls = (children) => {
    return children.map((child, index) => (
      <div key={index} className="filter__field-control">
        {child}
      </div>
    ))
  }

  return (
    <div className="filter">
      <h2 className="filter__title title"> Поиск по параметрам</h2>
      <div className="filter__main-info">
        {mainSubFilterChildren.map((child, i) => {
          return (
            <div className="filter__field" key={i}>
              <div className="filter__field-controls">
                {createFilterControls(child)}
              </div>
            </div>
          )
        })}
      </div>
      <div className="filter__secondary">
        {secondarySubFilterChildren.map((child, i) => {
          return (
            <div className="filter__field" key={i}>
              <div className="filter__field-controls">
                {createFilterControls(child)}
              </div>
            </div>
          )
        })}
      </div>
      <div className="filter__control">
        <NavLink
          className={`filter__show ${amount ? '' : 'filter__show--disabled'}`}
          to={`/filter${createUrlParams()}`}
          onClick={(e) => {
            if (!amount) {
              e.preventDefault()
            }
          }}
        >
          {amount ? `Показать ${amount} объявления` : 'Ничего не найдено'}
        </NavLink>
      </div>
    </div>
  )
}
export default Filter
