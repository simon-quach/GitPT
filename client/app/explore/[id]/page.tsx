'use client'

import Clipboard from '../../assets/icons/clipboard.svg'
import Github from '../../assets/icons/github.svg'
import Image from 'next/image'
import Router from 'next/router'
import {useEffect, useState} from 'react'
import axios, {AxiosResponse} from 'axios'

interface PathObject {
  path: string
  uuid: string
}

interface TreeNode {
  uuid?: string
  type: string
  name: string
  children?: {[key: string]: TreeNode}
}

interface Tree {
  [key: string]: TreeNode
}

interface FileObject {
  _id: string
  path: string
  fullpath: string
  summary: string
  contents: string
  embedding: [number]
}

function generateTree(paths: PathObject[]): {[key: string]: TreeNode} {
  let tree: {[key: string]: TreeNode} = {}
  paths.forEach((pathObj) => {
    let parts = pathObj.path.split('/')
    let subtree: {[key: string]: TreeNode} | undefined = tree
    parts.forEach((part, index) => {
      if (!subtree![part]) {
        if (index === parts.length - 1) {
          // This is a file, not a directory
          subtree![part] = {uuid: pathObj.uuid, type: 'file', name: part}
        } else {
          // This is a directory
          subtree![part] = {type: 'directory', children: {}, name: part}
        }
      }
      if (index !== parts.length - 1) {
        subtree = subtree![part].children
      }
    })
  })
  return tree
}

const emptyFileObject: FileObject = {
  _id: '',
  path: '',
  fullpath: '',
  summary: '',
  contents: '',
  embedding: [0],
}

const Repository = () => {
  const {id} = Router.query
  const [tree, setTree] = useState<Tree>({})
  const [currentPath, setCurrentPath] = useState('')
  const [fileType, setFileType] = useState('directory')
  const [fileContents, setFileContents] = useState<FileObject>(emptyFileObject)
  let keys = currentPath.split('/')

  function getLeafObject(keys: string[]) {
    let subtree: Tree = tree
    let leaf: TreeNode | null = null
    for (let i = 0; i < keys.length; i++) {
      if (subtree[keys[i]]) {
        leaf = subtree[keys[i]]
        subtree = subtree[keys[i]].children!
      } else {
        return null
      }
    }
    return leaf
  }

  useEffect(() => {
    if (!id) {
      Router.push('/')
    }
    axios
      .get(`http://localhost:3000/breadcrumb/${id}`)
      .then((res: AxiosResponse<any>) => {
        setTree(generateTree(JSON.parse(res.data)))
      })
  }, [id])

  useEffect(() => {
    const leaf = getLeafObject(keys)
    if (leaf) {
      if (leaf.type === 'file') {
        axios
          .get(`http://localhost:3000/getdocs/${id}/${leaf.uuid}`)
          .then((res: AxiosResponse<any>) => {
            setFileContents(res.data)
            setFileType('file')
          })
      } else {
        setFileType('directory')
        setFileContents(emptyFileObject)
      }
    }
  }, [currentPath])

  return (
    <div className="min-h-[calc(100vh-100px)] flex flex-col text-white px-[8rem]">
      {fileType === 'file' ? (
        <div className="">
          <div className="text-left font-medium text-[12px]">
            {keys.map((key: string, index: number) => (
              <span key={index}>{key} &gt;</span>
            ))}
          </div>
          <div className=" w-full h-[36rem] mt-[1rem] flex flex-col rounded-md overflow-hidden">
            <div className="w-full h-[36px] flex items-center relative bg-[#1E2022]">
              <Image
                src={Clipboard}
                alt="clipboard"
                className="absolute left-2"
              />
            </div>
            <div className="w-ful h-full flex">
              <div className="bg-[#161718] w-[70%] text-[12px] px-[1rem] py-[1rem]">
                <div className="font-mono">
                  {fileContents.contents ? fileContents.contents : ''}
                </div>
              </div>
              <div className="bg-[#131315] w-[30%] flex flex-col items-center justify-between px-[2rem] py-[2rem]">
                <div className="">
                  <div className="text-[#62a1ff] text-[8px]">File Name</div>
                  <div className="text-[16px]">
                    {fileContents.path
                      ? fileContents.path.split('/').pop()
                      : ''}
                  </div>
                  <br />
                  <div className="text-[#62a1ff] text-[8px]">Path</div>
                  <div className="text-[12px]">
                    {fileContents.path ? fileContents.path : ''}
                  </div>
                  <br />
                  <div className="text-[#62a1ff] text-[8px]">Summary</div>
                  <div className="text-[12px]">
                    {fileContents.summary ? fileContents.summary : ''}
                  </div>
                </div>
                <div className="font-bold group flex items-center justify-center gap-2 bg-white text-[#1B1C1E] px-[1rem] py-[0.5rem] rounded-md cursor-pointer hover:bg-[rgba(0,0,0,0)] hover:text-white border-[1px] transition-all">
                  <Image
                    src={Github}
                    alt="github"
                    className="group-hover:invert"
                  />
                  <div>Open in Github</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}

export default Repository
