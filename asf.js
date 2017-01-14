
//import _ from 'lodash';
import path from 'path';
import fs from 'fs-promise';

let afs={};

afs.mkdir = async (dir_path,mode,dir_root) => { 

	const _recursive_loop = async (base_dir,dir_array) => {
				
		try {
			let fs_STAT = await fs.stat(base_dir);						
		}
		catch(e) {					
			await fs.mkdir(base_dir);
			//console.log("ho creato ",base_dir);
		}

		if (dir_array.length === 0 )
			return true;
		else
			await _recursive_loop(path.join(base_dir,dir_array.shift()),dir_array);

	}

	try {
		let fs_STAT = await fs.stat(dir_path);				
		return null;		
	}
	catch(e) {
		
		const dir_array  = dir_path.split(path.sep);
		dir_array.shift(); //remove the first element ""		
		return await _recursive_loop(path.join('/',dir_array.shift()),dir_array);				
	}
}

afs.copy = async (src,dst) => {

	let rd = fs.createReadStream(src);
	let wr = fs.createWriteStream(dst);

	//TODO this function is actually not tested
	function rejectCleanup(err) {
		rd.unpipe(wr);
		//rd.destroy(); does it exists? 
		wr.end();
		throw err;
	}
	
	rd.on('error', rejectCleanup);
	wr.on('error', rejectCleanup);
	wr.on('finish', () => true);

	rd.pipe(wr);

} 

afs.delete = async (path) => fs.unlink(path);



export default afs;

