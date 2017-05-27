const fs = require('fs');
const path = require('path'); 

class Workflow {
  constructor(data = {}, basepath) {
    this.basepath = basepath;
    this.data = data;
    if (!this.data.steps) {
      this.data.steps = [];
    }
  }

  getName() {
    return this.data.name;
  }

  setName(name) {
    this.data.name = name;
    return this; 
  }

  addStep(step) {
    if (step.configuration && step.configuration.file) {
      const fpath = path.resolve(this.basepath, step.configuration.file);
      step.configuration.code = fs.readFileSync(fpath, 'UTF-8');
    }
    
    let found = false;
    this.data.steps = this.data.steps.map((cStep) => {
      if (cStep.label === step.label) {
        found = true;
        return step;
      }
      return cStep;
    });
    if (!found) {
      this.data.steps.push(step);
    }
    return this;
  }

  getStep(label) {
    return this.data.find((step) => {
      return step.label === label;
    });
  }

  removeStep(label) {
    this.data.steps = this.data.steps.filter((step) => {
      return step.label !== label;
    });
    return this;
  }

  normalize() {
    return {
      name: this.data.name,
      steps: this.data.steps.map((step) => {
        if (!step.configuration){
          return step;
        } 
        if(step.configuration.code) {
          delete step.configuration.code; 
        }
        if (step.configuration.file) {
          step.configuration.file = path.relative(this.basepath, step.configuration.file);
        }
        return step;
      })
    };
  }

  normalizeForServer() {
    return {
      name: this.data.name,
      configuration: this.data.steps.map((step) => {
        if (step.configuration && step.configuration.file) {
          delete step.configuration.file;  
        }
        return step;
      })
    };
  }

  write(file) {
    fs.writeFileSync(file, JSON.stringify(this.normalize(), null, 4), 'UTF-8');
    return this;
  }

  static load(file) {
    const data = JSON.parse(fs.readFileSync(file, 'UTF-8'));
    const basepath = path.dirname(file);
    const workflow = new Workflow({ name: data.name }, basepath);

    data.steps.forEach((step) => {
      workflow.addStep(step);
    });

    return new Workflow(data, basepath);
  }
}

module.exports = {
  create: function(name, basepath) {
    return new Workflow({ name }, basepath);
  },
  open: function(file) {
    return Workflow.load(file);
  },
  save: function(workflow, file) {
    return workflow.write(file);
  }
};