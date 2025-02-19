import { motion } from 'framer-motion';
import { blur, translate } from './anim';


const Body = ({links, selectedLink, setSelectedLink}) => {

    const getChars = (word) => {
        let chars = [];
        word.split("").forEach( (char, i) => {
          chars.push(
            <motion.span 
                custom={[i * 0.02, (word.length - i) * 0.01]} 
                variants={translate} initial="initial" 
                animate="enter" 
                exit="exit" 
                key={char + i}
            >
                {char}
            </motion.span>
            )
        })
        return chars;
    }

    return (
        <div className='flex flex-wrap mt-[40px] max-w-full md:max-w-[1200px] uppercase text-[#0B1215] bg-green-500 w-ful'>
            {
                links.map( (link, index) => {
                    const { title, href } = link;
                    return (

                    <a key={`l_${index}`} href={href} className='' style={{textDecoration: "none", color: "#0B1215"}}>

                        <motion.p
                            onMouseOver={() => {setSelectedLink({isActive: true, index})}} 
                            onMouseLeave={() => {setSelectedLink({isActive: false, index})}} 
                            variants={blur} 
                            animate={selectedLink.isActive && selectedLink.index != index ? "open" : "closed"}
                            className='m-0 flex overflow-hidden text-[32px] pr-[30px] pt-[10px] font-light'
                        >
                            {getChars(title)}
                        </motion.p>

                    </a>
                    )
                })
            }

        </div>
    )

}
export default Body;