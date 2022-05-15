const fn = {
    next_diardi : c => ((c+1) % 4) === 0,
    curr_diardi : c => (c % 4) === 0,
    prev_diardi : c => ((c-1) % 4) === 0,
};
const _target = (diardi, current_height) => {

    let last_height = current_height;
    let next_height = current_height+1;
    const current_is_diardi = fn.curr_diardi(current_height);
    const next_diardi_block = fn.next_diardi(current_height);
    if(!diardi) {
      if(current_is_diardi) { // Current is diardi
         --last_height;
      } else if(next_diardi_block) { // Next is diardi
          next_height = current_height+2;
      }
    } else {
      const mod = current_height%4;
      last_height = current_height - mod;
      next_height = last_height+4;
    }
    return {last_height,next_height};
}
const next_target = (diardi, current_height) => {
    const current = _target(diardi, current_height);
    const prev = _target(diardi, current.last_height-1);
    return {
      diardi,
      argue:current_height,
      current:current.last_height,
      next:current.next_height,
      prev:prev.last_height,
    };
}

for(let i =0;i<100;i++) {
  console.log(next_target(false, i));
  console.log(next_target(true, i));
}
