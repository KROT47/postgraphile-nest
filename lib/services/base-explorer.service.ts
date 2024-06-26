import { ModulesContainer } from '@nestjs/core';
import { Module } from '@nestjs/core/injector/module';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';

function flattenDeep(arr) {
  return Array.isArray(arr)
    ? arr.reduce((a, b) => a.concat(flattenDeep(b)), [])
    : [arr];
}

export abstract class BaseExplorerService {
  constructor(protected readonly modulesContainer: ModulesContainer) {}

  /**
   * Obtains all the providers from the modules passed then maps them with the mapModule callback.
   * If the mapping generates a list, the returned value is flattened so all nested arrays are
   *  merged into one array.
   */
  protected evaluateModules(
    modules: Module[],
    mapModule: (instance: InstanceWrapper, moduleRef: Module) => any,
  ) {
    const invokeMap = () =>
      modules.map((module) =>
        [...module.providers.values()].map((wrapper) =>
          mapModule(wrapper, module),
        ),
      );
    return flattenDeep(invokeMap()).filter((x) => x);
  }

  /**
   * Gathers all modules
   */
  protected getModules() {
    return [...this.modulesContainer.values()];
  }
}
