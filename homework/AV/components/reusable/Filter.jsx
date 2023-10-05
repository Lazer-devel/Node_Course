import { useCallback, useEffect, useState } from 'react'
import { createAgeArr, createVolumeArr } from './utils'
import DropDown from './DropDown'
import Input from './Input'

import './styles/filter.scss'
import { useParams, useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'

function Filter() {
  const searchParams = useSearchParams()
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
    const router = useRouter()
    const params = useParams()
    useEffect(() => {
      if (router.pathname === '/filter') {
        return
      }
      setMark(params.mark)
      setModel(params.model)
    }, [params, router])
  }

  useEffect(() => {
    const fetchData = async () => {
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
        setGenerationList(await generations.json())
      }
    }
    fetchData()
  }, [mark, model])

  const createSearchParams = useCallback(() => {
    const searchParams = new URLSearchParams()
    mark && searchParams.append('mark', mark)
    model && searchParams.append('model', model)
    generation && searchParams.append('generation', generation)
    beginYear && searchParams.append('beginYear', beginYear)
    endYear && searchParams.append('endYear', endYear)
    beginCost && searchParams.append('beginCost', beginCost)
    endCost && searchParams.append('endCost', endCost)
    beginVolume && searchParams.append('beginVolume', beginVolume)
    endVolume && searchParams.append('endVolume', endVolume)

    return `${searchParams.size ? `?${searchParams.toString()}` : ''}`
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

  const createHref = () => {
    if (
      !(
        generation ||
        endVolume ||
        beginVolume ||
        endCost ||
        beginCost ||
        endYear ||
        beginYear
      )
    ) {
      let href = '/catalog'
      href += mark ? `/${mark}` : ''
      href += model ? `/${model}` : ''
      return href
    }

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
    return `/filter?${urlParams.toString()}`
  }
  useEffect(() => {
    if (!markList) {
      return
    }
    const getAdCount = async () => {
      const amount = await fetch(`/api/adCount${createSearchParams()}`, {
        cache: 'no-store',
        credentials: 'include',
      })
      setAmount(await amount.json())
    }

    getAdCount()
  }, [createSearchParams, markList])

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
            src={`/generations/200x200/${id}.jpeg`}
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
        <Link
          className={`filter__show ${amount ? '' : 'filter__show--disabled'}`}
          href={createHref()}
          onClick={(e) => {
            if (!amount) {
              e.preventDefault()
            }
          }}
        >
          {amount ? `Показать ${amount} объявления` : 'Ничего не найдено'}
        </Link>
      </div>
    </div>
  )
}
export default Filter
